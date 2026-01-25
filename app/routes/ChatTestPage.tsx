import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";

type MessageDto = {
    id?: number;
    content: string;
    sender?: string;
    createdAt?: string;
};

const ChatTestPage: React.FC = () => {
    const [chatId, setChatId] = useState<number>(1);
    const [content, setContent] = useState("");
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        // PROVERA: da li je browser (window postoji)
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token"); // JWT
        if (!token) {
            alert("Nema JWT tokena u localStorage");
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 5000,
            debug: (str) => console.log("STOMP:", str),
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        client.onConnect = () => {
            console.log("✅ WebSocket connected");
            client.subscribe(`/topic/chat/${chatId}`, (message) => {
                const body = JSON.parse(message.body);
                setMessages((prev) => [...prev, body]);
            });
        };

        client.onStompError = (frame) => {
            console.error("❌ Broker error:", frame.headers["message"]);
        };

        client.onWebSocketError = (event: Event) => {
            console.error("❌ WebSocket error:", event);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            console.log("🔌 WebSocket disconnected");
        };
    }, [chatId]);

    const sendMessage = () => {
        if (!content.trim() || !clientRef.current?.connected) return;

        clientRef.current.publish({
            destination: "/app/chat.send",
            body: JSON.stringify({
                chatId,
                content,
            }),
        });

        setContent("");
    };

    return (
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
            <h2>🧪 WebSocket Chat Test</h2>

            <div style={{ marginBottom: 10 }}>
                <label>Chat ID:</label>
                <input
                    type="number"
                    value={chatId}
                    onChange={(e) => setChatId(Number(e.target.value))}
                    style={{ marginLeft: 10, width: 80 }}
                />
            </div>

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: 10,
                    height: 300,
                    overflowY: "auto",
                    marginBottom: 10,
                }}
            >
                {messages.map((m, index) => (
                    <div key={index}>
                        <b>{m.sender ?? "user"}:</b> {m.content}
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Unesi poruku..."
                    style={{ flex: 1 }}
                />
                <button onClick={sendMessage}>Pošalji</button>
            </div>
        </div>
    );
};

export default ChatTestPage;
