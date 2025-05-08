import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { mockUsers, mockMessages } from "../data/mockData";


const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load mock data when component mounts
  useEffect(() => {
    if (currentUser) {
      // Filter out current user from users list
      const filteredUsers = mockUsers.filter(
        (user) => user.id !== currentUser.id
      );
      setUsers(filteredUsers);

      // Set up conversations
      setConversations(mockMessages);

      // Set default selected conversation if none is selected
      if (!selectedConversation && filteredUsers.length > 0) {
        setSelectedConversation(filteredUsers[0].id);
      }

      setLoading(false);
    }
  }, [currentUser, selectedConversation]);

  // Send a new message
  const sendMessage = (text) => {
    if (!selectedConversation || !text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
    };

    setConversations((prev) => {
      const conversationMessages = prev[selectedConversation] || [];
      return {
        ...prev,
        [selectedConversation]: [...conversationMessages, newMessage],
      };
    });

    // Simulate receiving a response after a delay
    setTimeout(() => {
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedConversation,
        text: getRandomResponse(),
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) => {
        const conversationMessages = prev[selectedConversation] || [];
        return {
          ...prev,
          [selectedConversation]: [...conversationMessages, responseMessage],
        };
      });
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  // Helper function to get a random response
  const getRandomResponse = () => {
    const responses = [
      "That's interesting!",
      "I see what you mean.",
      "Tell me more about that.",
      "I hadn't thought of it that way.",
      "That makes sense.",
      "How does that make you feel?",
      "What happened next?",
      "I appreciate you sharing that with me.",
      "Let's discuss this further.",
      "I'm not sure I understand. Can you explain?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const value = {
    users,
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
    loading,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
