// src/pages/ChatsPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

type ChatListItemDto = {
  id: number;
  otherUsername: string;
  otherProfileImageUrl: string;
  lastMessage: string;
  lastMessageCreatedAt: string;
  lastMessageUsername: string;
};

export default function ChatsPage() {
  const [chats, setChats] = useState<ChatListItemDto[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // 1️⃣ Učitaj token iz localStorage samo u browseru
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  // 2️⃣ Učitaj sve chatove
  useEffect(() => {
    if (!token) return;

    axios
      .get<ChatListItemDto[]>(`http://localhost:8080/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setChats(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  if (!token) return <div>Loading...</div>;

  return (
    <div className="flex flex-col flex-1 bg-gray-300 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold my-4 text-center">Your Chats</h2>
      <div className="flex flex-col gap-2">
        {chats.map((chat) => (
          <Link
            to={`/chat/${chat.otherUsername}`}
            key={chat.id}
            className="flex items-center p-2 border rounded-2xl bg-gray-200"
          >
            <img
              src={`http://localhost:8080/images/${chat.otherProfileImageUrl}`}
              alt={chat.otherUsername}
              className="w-12 h-12 rounded-full mr-3 object-cover"
            />
            <div className="flex-1">
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
