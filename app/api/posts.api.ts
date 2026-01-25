interface SinglePostDto {
    id: number;
    imageUrl: string;
    createdAt: string;
    description: string;
    userId: number;
    username: string;
    profileImageUrl: string | null;
}

export async function createPost(
  description: string,
  image: File
): Promise<SinglePostDto> {
  const formData = new FormData();
  formData.append("image", image);

  formData.append(
    "post",
    new Blob([JSON.stringify({ description })], {
      type: "application/json",
    })
  );

  const res = await fetch("http://localhost:8080/api/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const message = await res.text();
    throw {
      status: res.status,
      message: message || "Failed to create post",
    };
  }

  return res.json();
}


export async function updatePost(postId: number, newDescription: string): Promise<SinglePostDto> {
    const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newDescription }),
    });

    if (!res.ok) {
        const message = await res.text();
        throw {
            status: res.status,
            message: message || "Failed to update post",
        };
    }

    return res.json();
}


export async function deletePost(postId: number): Promise<void> {
    const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!res.ok) {
        const message = await res.text();
        throw {
            status: res.status,
            message: message || "Failed to delete post",
        };
    }
}