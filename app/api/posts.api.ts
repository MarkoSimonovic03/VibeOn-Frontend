import { apiFetch } from "./apiFetch";

export interface SinglePostDto {
  id: number;
  imageUrl: string;
  createdAt: string;
  description: string;
  userId: number;
  username: string;
  profileImageUrl: string | null;
}

export async function createPost(description: string, image: File): Promise<SinglePostDto> {
  const formData = new FormData();
  formData.append("image", image);

  formData.append(
    "post",
    new Blob([JSON.stringify({ description })], {
      type: "application/json",
    })
  );

  return apiFetch("/api/posts", {
    method: "POST",
    body: formData,
  });
}


export function getPosts(path: string): Promise<SinglePostDto[]> {
  return apiFetch<SinglePostDto[]>(path);
}


export async function updatePost(postId: number, newDescription: string): Promise<SinglePostDto> {
  return apiFetch(`/api/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newDescription }),
  });
}


export async function deletePost(postId: number): Promise<void> {
  return apiFetch(`/api/posts/${postId}`, {
    method: "DELETE",
  });
}