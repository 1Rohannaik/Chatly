import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
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

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ text, image }) => {
    const { selectedUser, messages } = get();
    const authUser = get().authUser;

    // Validate user selection and authentication
    if (!selectedUser || !selectedUser.id) {
      toast.error("No user selected for sending the message.");
      console.error("Error: selectedUser is undefined or has no ID");
      return;
    }

    if (!authUser || !authUser.id) {
      toast.error("No authenticated user available.");
      console.error("Error: authUser is undefined or has no ID");
      return;
    }

    // Validate that message or image is provided
    if (!text?.trim() && !image) {
      toast.error("Message or image is required.");
      console.error("Error: No message or image provided");
      return;
    }

    try {
      const payload = {
        senderId: authUser.id,
        receiverId: selectedUser.id,
      };

      // Add message to payload if provided
      if (text?.trim()) payload.message = text.trim();
      // Add image URL to payload if provided (ensure image is base64-encoded)
      if (image) payload.imageUrl = image;

      console.log("Sending payload:", payload);

      // Send the request to the server
      const res = await axiosInstance.post(
        `/message/send/${selectedUser.id}`,
        payload
      );

      // Update local state with the new message
      set({ messages: [...messages, res.data] });

      return res.data;
    } catch (error) {
      // Handle error and display appropriate message
      const errMsg = error.response?.data?.message || "Failed to send message";
      console.error("Send message error:", {
        error: error.response?.data || error.message,
        payload: { text, image },
      });
      toast.error(errMsg);
      throw error; // Re-throw the error for further handling if needed
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  resetChatState: () => set({ messages: [] }),
}));
