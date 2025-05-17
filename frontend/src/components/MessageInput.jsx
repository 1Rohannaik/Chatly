import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { sendMessage, currentChatUserId } = useChatStore();

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        e.target !== inputRef.current
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    inputRef.current?.focus();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedText = text.trim();
    const imageFile = fileInputRef.current?.files?.[0] || null;

    if (!trimmedText && !imageFile) {
      toast.error("Please enter a message or select an image.");
      return;
    }

    try {
      await sendMessage({
        userId: currentChatUserId,
        text: trimmedText,
        image: imageFile,
      });

      // Clear input and preview after send
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      inputRef.current?.focus();
      setShowEmojiPicker(false);
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    }
  };

  const handleEmojiSelect = (emoji) => {
    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const newText = text.slice(0, start) + emoji.native + text.slice(end);

    setText(newText);

    // Focus input and move cursor after inserted emoji
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(
        start + emoji.native.length,
        start + emoji.native.length
      );
    }, 0);
  };

  return (
    <div className="p-4 w-full relative">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 relative">
          <input
            type="text"
            ref={inputRef}
            className="w-full input input-bordered rounded-lg input-sm sm:input-md pr-10"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoComplete="off"
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <button
              type="button"
              className={`btn btn-ghost btn-xs ${
                imagePreview ? "text-emerald-500" : "text-zinc-400"
              } hover:bg-transparent hover:text-emerald-500`}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach Image"
            >
              <Image size={18} />
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-xs text-zinc-400 hover:bg-transparent hover:text-emerald-500"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                inputRef.current?.focus();
              }}
              aria-label="Add Emoji"
            >
              <Smile size={18} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
          aria-label="Send Message"
        >
          <Send size={22} />
        </button>
      </form>

      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-16 right-0 z-50 w-full max-w-xs shadow-lg rounded-lg overflow-hidden"
        >
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            previewPosition="none"
            searchPosition="none"
            skinTonePosition="none"
            perLine={8}
            emojiSize={24}
            emojiButtonSize={32}
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
