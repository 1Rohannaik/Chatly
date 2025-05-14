import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser?.id) {
      getMessages(selectedUser.id);
    }
  }, [selectedUser?.id, getMessages]);

  // Scroll to latest message when messages update
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${
              message.senderId === authUser.id ? "chat-end" : "chat-start"
            }`}
          >
            {/* Avatar */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser.id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            {/* Timestamp */}
            <div className="chat-header mb-1">
              <time
                className="text-xs opacity-50 ml-1"
                title={new Date(message.createdAt).toLocaleString()}
              >
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Message bubble */}
            <div className="chat-bubble flex flex-col">
              {message.imageUrl && (
                <img
                  loading="lazy"
                  src={message.imageUrl}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                  onError={(e) => {
                    e.target.src = "/fallback-image.png";
                  }}
                />
              )}
              {message.message && <p>{message.message}</p>}
            </div>
          </div>
        ))}
        {/* Invisible div to auto-scroll to bottom */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
