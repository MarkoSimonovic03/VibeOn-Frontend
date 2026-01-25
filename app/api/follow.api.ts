export async function toggleFollow(userId: number): Promise<void> {
  const res = await fetch(`http://localhost:8080/api/follows/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw {
      status: res.status,
      message: message || "Failed to toggle follow",
    };
  }
}