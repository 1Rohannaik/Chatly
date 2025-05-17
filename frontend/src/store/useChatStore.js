import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  get authUser() {
    return useAuthStore.getState().authUser;
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axiosInstance.get("/message/users");
      set({ users: data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const { data } = await axiosInstance.get(`/message/${userId}`);
      set({ messages: data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ text, image }) => {
    const { selectedUser, messages, authUser } = get();

    if (!selectedUser?.id || !authUser?.id) {
      toast.error("User not selected or not authenticated.");
      return;
    }
    if (!text?.trim() && !image) {
      toast.error("Message or image is required.");
      return;
    }

    let imageUrl = null;
    if (image) {
      imageUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    }

    try {
      const { data } = await axiosInstance.post(
        `/message/send/${selectedUser.id}`,
        { message: text?.trim() || "", imageUrl },
        { headers: { "Content-Type": "application/json" } }
      );

      set({ messages: [...messages, data] });
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to send message");
      throw error;
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  resetChatState: () => set({ messages: [] }),

  subscribeToMessages: () => {
    const { selectedUser, authUser } = get();
    const socket = useAuthStore.getState().socket;
    if (!selectedUser || !socket || !authUser) return;

    socket.on("newMessage", (newMessage) => {
      const isRelevant =
        (newMessage.senderId === selectedUser.id &&
          newMessage.receiverId === authUser.id) ||
        (newMessage.senderId === authUser.id &&
          newMessage.receiverId === selectedUser.id);

      if (isRelevant) {
        set((state) => ({ messages: [...state.messages, newMessage] }));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },
}));
