import { useState } from "react";
import { Link } from "react-router-dom";
import { deletePost, updatePost } from "~/api/posts.api";
import ButtonVibeon from "./ButtonVibeon";

export interface SinglePostDto {
  id: number;
  description: string;
  imageUrl: string;
  createdAt: string;
  userId: number;
  username: string;
  profileImageUrl: string | null;
}

interface PostsProps {
  posts: SinglePostDto[];
  loading: boolean;
  error: string;
  onPostUpdated?: (post: SinglePostDto) => void;
  onPostDeleted?: (id: number) => void;
}

export default function Posts({ posts, loading, error, onPostUpdated, onPostDeleted }: PostsProps) {
  const loggedUsername = typeof window !== "undefined" ? localStorage.getItem("username") : null;
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState<string>("");

  const handleEdit = (post: SinglePostDto) => {
    setEditingPostId(post.id);
    setEditedDescription(post.description);
  };

  const handleSave = async (postId: number) => {
    try {
      const updatedPost = await updatePost(postId, editedDescription);
      onPostUpdated?.(updatedPost);
      setEditingPostId(null);
      setEditedDescription("");
    } catch (err: any) {
      console.error(err);
      alert(`Error (${err?.status ?? "?"}): ${err?.message ?? "Request failed"}`);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete the post?")) return;

    try {
      await deletePost(postId);
      onPostDeleted?.(postId);
    } catch (err: any) {
      console.error(err);
      alert(`Error (${err?.status ?? "?"}): ${err?.message ?? "Request failed"}`);
    }
  };


  if (loading) return <p className="text-center mt-10 text-gray-500">Loading posts...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-8">
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-200 rounded-2xl shadow-lg shadow-black/40 border-2 border-gray-300">

          <div className="flex justify-between items-centar p-4">
            <Link to={`/profile/${post.username}`} className="flex items-center gap-3">
              <img
                src={post.profileImageUrl ? "http://localhost:8080/images/" + post.profileImageUrl : "profile.png"}
                alt="avatar" className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-xl">{post.username}</p>
                <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </Link>

            <div>
              <div className="flex items-center gap-2 h-full">
                {(editingPostId === post.id) && (
                  <>
                    <ButtonVibeon onClick={() => handleSave(post.id)} name={"Save"} />
                    <ButtonVibeon onClick={() => setEditingPostId(null)} name={"Cancel"} />
                  </>
                )}

                {post.username === loggedUsername && editingPostId !== post.id && (
                  <>
                    <ButtonVibeon onClick={() => handleEdit(post)} name={"Edit"} />
                    <ButtonVibeon onClick={() => handleDelete(post.id)} name={"Delete"} />
                  </>
                )}
              </div>
            </div>
          </div>

          <img src={"http://localhost:8080/images/" + post.imageUrl} alt="post" className="w-full aspect-[4/3] object-cover" />

          <div className="p-4">
            {editingPostId === post.id ? (
              <input type="text" className="w-full bg-white border border rounded p-2" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
            ) : (
              <p className="text-gray-800">{post.description}</p>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}