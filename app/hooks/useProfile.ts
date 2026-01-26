import { useEffect, useState, useCallback } from "react";
import { getProfileInfo, type UserProfileDto } from "~/api/auth.api";

export function useProfile(username?: string) {
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getProfileInfo(username);
        setProfile(data);
      } catch (err: any) {
        console.error(err);
        setError(
          `Error (${err?.status ?? "?"}): ${
            err?.message ?? "Failed to load profile"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const toggleFollow = useCallback(() => {
    setProfile((prev) => (prev ? { ...prev, isFollowing: !prev.isFollowing } : prev));
  }, []);

  return { profile, loading, error, toggleFollow };
}
