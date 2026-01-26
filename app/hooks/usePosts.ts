import { useEffect, useState, useCallback } from "react";
import { getPosts, type SinglePostDto } from "~/api/posts.api";

export function usePosts(path: string) {
  const [posts, setPosts] = useState<SinglePostDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getPosts(path);
        setPosts(data);
      } catch (err: any) {
        console.error(err);
        setError(
          `Error (${err?.status ?? "?"}): ${
            err?.message ?? "Failed to load posts"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [path]);

  const updatePost = useCallback((updated: SinglePostDto) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  }, []);

  const deletePost = useCallback((id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { posts, loading, error, updatePost, deletePost };
}