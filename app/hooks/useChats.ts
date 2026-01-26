import { useEffect, useState } from "react";
import { fetchChats, type ChatListItemDto } from "~/api/chats.api";

export function useChats() {
  const [chats, setChats] = useState<ChatListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchChats();
        setChats(data);
      } catch (err: any) {
        console.error(err);
        setError(`Error (${err?.status ?? "?"}): ${err?.message ?? "Request failed"}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { chats, loading, error };
}
