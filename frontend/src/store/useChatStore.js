import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore"; // Import your auth store

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Get the authUser from the auth store
  get authUser() {
    return useAuthStore.getState().authUser; // Access the authUser from the auth store
  },

  // Get Users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Get Messages
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send Message
  sendMessage: async ({ text, image }) => {
  const { selectedUser, messages, socket } = get();
  const authUser = get().authUser;

  if (!selectedUser?.id || !authUser?.id) {
    toast.error("User selection or authentication error.");
    return;
  }

  if (!text?.trim() && !image) {
    toast.error("Message or image is required.");
    return;
  }

  try {
    const payload = {
      senderId: authUser.id,
      receiverId: selectedUser.id,
    };

    if (text?.trim()) payload.message = text.trim();
    if (image) payload.imageUrl = image;

    // ✅ Send to server via REST API
    const res = await axiosInstance.post(
      `/message/send/${selectedUser.id}`,
      payload
    );

    // ✅ Emit real-time message to receiver via Socket.IO
    socket?.emit("send-message", {
      message: res.data.message,
      from: authUser.id,
      to: selectedUser.id,
    });

    // ✅ Update local state
    set({ messages: [...messages, res.data] });

    return res.data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || "Failed to send message";
    toast.error(errMsg);
    throw error;
  }
},


  // Set selected user for chat
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // Reset chat state
  resetChatState: () => set({ messages: [] }),
}));
