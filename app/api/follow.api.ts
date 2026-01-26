import { apiFetch } from "~/api/apiFetch";

export function toggleFollow(userId: number): Promise<void> {
  return apiFetch(`/api/follows/${userId}`, {
    method: "POST",
  });
}
