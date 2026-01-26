import { Link } from "react-router-dom";
import { API_BASE_URL } from "src/config/api";
import { useChats } from "~/hooks/useChats";

export default function ChatsPage() {
  const { chats, loading, error } = useChats();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col flex-1 bg-gray-300 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold my-4 text-center">Your Chats</h2>

      <div className="flex flex-col gap-2">
        {chats.map((chat) => (
          <Link key={chat.id} to={`/chat/${chat.otherUsername}`} className="flex items-center p-2 border rounded-2xl bg-gray-200">
            <img src={`${API_BASE_URL}/images/${chat.otherProfileImageUrl}`} alt={chat.otherUsername} className="w-12 h-12 rounded-full mr-3 object-cover" />

            <div className="flex-1 min-w-0">
              <div className="font-semibold">{chat.otherUsername}</div>
              <div className="text-sm text-gray-600 truncate">
                {chat.lastMessageUsername}: {chat.lastMessage}
              </div>
            </div>

            <div className="text-xs text-gray-400 ml-2">
              {new Date(chat.lastMessageCreatedAt).toLocaleTimeString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
