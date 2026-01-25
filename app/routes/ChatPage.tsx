// src/pages/ChatPage.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import OtherChatMessage from "~/components/other_chat_message";
import MeChatMessage from "~/components/me_chat_message";

type MessageDto = {
  id: number;
  username: string;
  content: string;
  createdAt: string;
};

type ChatDto = {
  id: number;
  username: string;
  profileImageUrl: string;
  otherUsername: string;
  otherProfileImageUrl: string;
  messages: MessageDto[];
};

export default function ChatPage() {
  const { username } = useParams<{ username: string }>();
  const [chat, setChat] = useState<ChatDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const clientRef = useRef<Client | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const didInitialScrollRef = useRef(false);

  // 0) Token iz localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // 1) Učitaj chat preko REST-a
  useEffect(() => {
    if (!username || !token) return;

    axios
      .get<ChatDto>(`http://localhost:8080/api/chats/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setChat(res.data);

        const sorted = [...res.data.messages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        setMessages(sorted);

        // resetuj "initial scroll" kad otvoriš drugi chat
        didInitialScrollRef.current = false;
      })
      .catch((err) => console.error(err));
  }, [username, token]);

  // 2) WebSocket konekcija (nezavisno od chat state-a)
  useEffect(() => {
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      debug: () => {},
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [token]);

  // 3) Subscribe kad imamo chat.id + kad je client konektovan
  useEffect(() => {
    if (!chat?.id) return;

    const client = clientRef.current;
    if (!client) return;

    let sub: any;

    const trySubscribe = () => {
      if (!client.connected) return false;

      sub = client.subscribe(`/topic/chat/${chat.id}`, (msg) => {
        const body: MessageDto = JSON.parse(msg.body);
        setMessages((prev) => [...prev, body]);
      });
      return true;
    };

    // ako još nije konektovan, probaj kroz kratki interval
    if (!trySubscribe()) {
      const i = setInterval(() => {
        if (trySubscribe()) clearInterval(i);
      }, 150);

      return () => {
        clearInterval(i);
        if (sub) sub.unsubscribe();
      };
    }

    return () => {
      if (sub) sub.unsubscribe();
    };
  }, [chat?.id]);

  // 4) Inicijalni scroll: odmah na dno (bez smooth, pre paint-a)
  useLayoutEffect(() => {
    if (!chat) return;
    if (didInitialScrollRef.current) return;

    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    didInitialScrollRef.current = true;
  }, [chat]);

  // 5) Kad stigne nova poruka -> smooth na dno
  useEffect(() => {
    if (!didInitialScrollRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 6) Slanje poruke
  const sendMessage = () => {
    if (!clientRef.current?.connected || !newMessage.trim() || !chat) return;

    clientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ chatId: chat.id, content: newMessage }),
    });

    setNewMessage("");
  };

  if (!chat) return <div>Loading chat...</div>;

  return (
    <div className="flex flex-col flex-1 bg-gray-200 justify-center max-w-2xl mx-auto">
      <header className="flex items-center bg-gray-300 px-5 py-2 w-full gap-3">
        <NavLink to={"/chats"}>
          <img className="w-8 h-8" src="../../arrow-back-05.svg" />
        </NavLink>

        <NavLink
          to={`../profile/${chat.otherUsername}`}
          className="flex items-center gap-3"
        >
          <img
            className="w-13 h-13 object-cover rounded-full"
            src={`http://localhost:8080/images/${chat.otherProfileImageUrl}`}
          />
          <p className="text-2xl font-bold">{chat.otherUsername}</p>
        </NavLink>
      </header>

      <div className="w-full flex-1 overflow-y-auto overflow-x-hidden px-3">
        {messages.map((msg) =>
          msg.username === chat.username ? (
            <MeChatMessage
              key={msg.id}
              label={msg.content}
              imgURL={chat.profileImageUrl}
			  date={msg.createdAt}
            />
          ) : (
            <OtherChatMessage
              key={msg.id}
              label={msg.content}
              imgURL={chat.otherProfileImageUrl}
			  date={msg.createdAt}
            />
          ),
        )}

        {/* OVO MORA da postoji da scrollIntoView radi */}
        <div ref={messagesEndRef} />
      </div>

      <footer className="flex bg-gray-300 justify-center items-center p-3 w-full gap-4">
        <input
          type="text"
          className="flex-1 p-2 bg-white rounded-xl focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          className="bg-vibeon text-white px-4 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </footer>
    </div>
  );
}
