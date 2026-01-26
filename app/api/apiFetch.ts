import { API_BASE_URL } from "src/config/api";

type ApiError = {
  status: number;
  message: string;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw {
      status: res.status,
      message: message || "Request failed",
    } as ApiError;
  }

  // za DELETE / 204
  if (res.status === 204) {
    return null as T;
  }

  return res.json() as Promise<T>;
}
