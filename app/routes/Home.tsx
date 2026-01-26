import Posts from "../components/Posts";
import { usePosts } from "~/hooks/usePosts";

export default function Home() {
  const { posts, loading, error, updatePost, deletePost } =
    usePosts("/api/posts");

  return (
    <Posts posts={posts} loading={loading} error={error} onPostUpdated={updatePost} onPostDeleted={deletePost}
    />
  );
}
