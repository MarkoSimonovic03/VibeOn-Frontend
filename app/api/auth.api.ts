import { apiFetch } from "~/api/apiFetch";

export async function login(username: string, password: string): Promise<{ accessToken: string }> {
  return apiFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

export type RegisterDto = {
  username: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: boolean;
};

export async function registerUser(registerDto: RegisterDto, image?: File | null): Promise<void> {
  const formData = new FormData();
  if (image) formData.append("image", image);

  formData.append(
    "registerDto",
    new Blob([JSON.stringify(registerDto)], { type: "application/json" })
  );

  return apiFetch("/api/auth/register", {
    method: "POST",
    body: formData,
  });
}


export interface HeaderUserDto {
  username: string;
  profileImageUrl: string;
}

export async function fetchHeaderInfo(): Promise<HeaderUserDto> {
  return apiFetch("/api/auth/header-info");
}


export type UserProfileDto = {
  id: number;
  username: string;
  name: string;
  lastName: string;
  createdAt: string;
  email: string;
  profileImageUrl: string;
  birthDate: string;
  gender: boolean;
  isFollowing: boolean;
};

export function getProfileInfo(username: string): Promise<UserProfileDto> {
  return apiFetch<UserProfileDto>(`/api/auth/user/${username}`);
}
