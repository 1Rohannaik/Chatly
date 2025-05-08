import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ChatProvider, useChat } from "../contexts/ChatContext";
import { formatTime } from "../utils/helpers";
import {
  MenuIcon,
  SendIcon,
  LogoutIcon,
  PlusIcon,
  CloseIcon,
} from "../components/Icons";

// Main Chat component that wraps everything with the ChatProvider
function Chat() {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
}

// The actual chat interface
function ChatInterface() {
  const { currentUser, signout } = useAuth();
  const {
    users,
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
    createGroup,
  } = useChat();
  const [message, setMessage] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Group creation state
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedConversation]);

  const handleLogout = async () => {
    try {
      await signout();
      navigate("/signin");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedConversation) {
      sendMessage(message);
      setMessage("");
    }
  };

  const toggleMemberSelection = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    setShowGroupModal(true);
    setSelectedMembers([]);
    setGroupName("");
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    if (groupName.trim() && selectedMembers.length > 0) {
      await createGroup(groupName, selectedMembers);
      setShowGroupModal(false);
      setGroupName("");
      setSelectedMembers([]);
    }
  };

  // Find the selected conversation
  const selectedConversationData = selectedConversation
    ? users.find((user) => user.id === selectedConversation) ||
      conversations[selectedConversation]?.groupInfo
    : null;

  // Get messages for the selected conversation
  const conversationMessages = selectedConversation
    ? conversations[selectedConversation]?.messages || []
    : [];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        <MenuIcon />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transform transition-transform duration-300 ease-in-out fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10`}
      >
        {/* User profile */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={
                currentUser?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  currentUser?.name || "User"
                )}`
              }
              alt={currentUser?.name}
              className="h-10 w-10 rounded-full mr-3"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentUser?.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentUser?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Conversations list */}
        <div className="p-2">
          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Conversations
            </h3>
            <button
              onClick={handleCreateGroup}
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              title="Create group"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1">
            {Object.entries(conversations).map(([id, conversation]) => (
              <button
                key={id}
                className={`flex items-center w-full px-3 py-2 rounded-md ${
                  selectedConversation === id
                    ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}
                onClick={() => {
                  setSelectedConversation(id);
                  setMobileSidebarOpen(false);
                }}
              >
                {conversation.isGroup ? (
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center mr-3">
                      <span className="text-indigo-600 dark:text-indigo-300 font-medium">
                        {conversation.groupInfo?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={
                        users.find((u) => u.id === id)?.avatar ||
                        "/placeholder.svg"
                      }
                      alt={users.find((u) => u.id === id)?.name}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    {users.find((u) => u.id === id)?.status === "online" && (
                      <span className="absolute bottom-0 right-3 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {conversation.isGroup
                      ? conversation.groupInfo?.name
                      : users.find((u) => u.id === id)?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {conversation.isGroup
                      ? `${conversation.groupInfo?.memberIds.length} members`
                      : users.find((u) => u.id === id)?.status === "online"
                      ? "Online"
                      : `Last seen ${formatTime(
                          users.find((u) => u.id === id)?.lastSeen
                        )}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Logout button */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogoutIcon className="mr-2" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationData ? (
          <>
            {/* Chat header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
              <div className="flex items-center">
                {conversations[selectedConversation]?.isGroup ? (
                  <div className="h-10 w-10 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center mr-3">
                    <span className="text-indigo-600 dark:text-indigo-300 font-medium">
                      {selectedConversationData.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                ) : (
                  <img
                    src={selectedConversationData.avatar || "/placeholder.svg"}
                    alt={selectedConversationData.name}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedConversationData.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {conversations[selectedConversation]?.isGroup
                      ? `${selectedConversationData.memberIds.length} members`
                      : selectedConversationData.status === "online"
                      ? "Online"
                      : `Last seen ${formatTime(
                          selectedConversationData.lastSeen
                        )}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              <div className="space-y-4">
                {conversationMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === currentUser?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                        msg.senderId === currentUser?.id
                          ? "bg-indigo-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                    >
                      {!conversations[selectedConversation]?.isGroup ||
                      msg.senderId === currentUser?.id ? null : (
                        <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 mb-1">
                          {users.find((u) => u.id === msg.senderId)?.name}
                        </p>
                      )}
                      <p>{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderId === currentUser?.id
                            ? "text-indigo-200"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Welcome to Chatly
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Group creation modal - moved outside sidebar */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Group
              </h3>
              <button
                onClick={() => setShowGroupModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleGroupSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="group-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Group Name
                </label>
                <input
                  id="group-name"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-4 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  autoFocus
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Members
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedMembers.length} selected
                  </span>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                    {users
                      .filter((user) => user.id !== currentUser?.id)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          onClick={() => toggleMemberSelection(user.id)}
                        >
                          <img
                            src={
                              user.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user.name
                              )}`
                            }
                            alt={user.name}
                            className="h-8 w-8 rounded-full mr-3"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(user.id)}
                            onChange={() => toggleMemberSelection(user.id)}
                            className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!groupName.trim() || selectedMembers.length === 0}
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
