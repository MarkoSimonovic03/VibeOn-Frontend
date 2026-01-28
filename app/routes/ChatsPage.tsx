import { Link } from "react-router-dom";
import { API_BASE_URL } from "src/config/api";
import { useChats } from "~/hooks/useChats";

export default function ChatsPage() {
  const { chats, loading, error } = useChats();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col flex-1 bg-gray-300 w-full max-w-2xl mx-auto items-center px-4 sm:px-12 overflow-x-hidden">
      <h2 className="text-4xl font-bold text-left mt-4 text-vibeon w-full">
        Your Chats
      </h2>

      <hr className="w-full mb-2 border border-vibeon" />

      <div className="flex flex-col gap-2 w-full">
        {chats.map((chat) => (
          <Link to={`/chat/${chat.otherUsername}`} key={chat.id} className="flex items-center p-2 rounded-2xl bg-gray-200 w-full min-w-0" >
            <img src={`${API_BASE_URL}/images/${chat.otherProfileImageUrl}`} alt={chat.otherUsername} className="w-12 h-12 rounded-full mr-3 object-cover shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{chat.otherUsername}</div>
              <div className="text-sm text-gray-600 truncate">{chat.lastMessageUsername}: {chat.lastMessage} </div>
            </div>

            <div className="text-xs text-gray-400 ml-2 shrink-0 whitespace-nowrap">
              {new Date(chat.lastMessageCreatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
