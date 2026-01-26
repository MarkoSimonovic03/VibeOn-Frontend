import { apiFetch } from "./apiFetch";

export type ChatListItemDto = {
  id: number;
  otherUsername: string;
  otherProfileImageUrl: string;
  lastMessage: string;
  lastMessageCreatedAt: string;
  lastMessageUsername: string;
};

export function fetchChats(): Promise<ChatListItemDto[]> {
  return apiFetch<ChatListItemDto[]>("/api/chats");
}
