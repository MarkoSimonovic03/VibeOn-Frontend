import { useEffect, useState, useCallback } from "react";

export interface SinglePostDto {
  id: number;
  imageUrl: string;
  createdAt: string;
  description: string;
  userId: number;
  username: string;
  profileImageUrl: string | null;
}

export function usePosts(url: string) {
  const [posts, setPosts] = useState<SinglePostDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          const message = await res.text();
          throw { status: res.status, message: message || "Failed to fetch posts" };
        }

        setPosts(await res.json());
      } catch (err: any) {
        console.error(err);

        const status = err?.status;
        const message =
          err?.message || "Failed to load posts (network or server error).";

        setError(status ? `(${status}) ${message}` : message);
      }
      finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [url]);

  const updatePost = useCallback((updated: SinglePostDto) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  const deletePost = useCallback((id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { posts, loading, error, updatePost, deletePost };
}