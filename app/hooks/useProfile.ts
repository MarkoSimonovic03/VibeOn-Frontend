import { useEffect, useState, useCallback } from "react";

export interface UserProfileDto {
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
}

export function useProfile(username?: string) {
    const [profile, setProfile] = useState<UserProfileDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`http://localhost:8080/api/auth/user/${username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
                );

                if (!res.ok) {
                    const message = await res.text();
                    throw { status: res.status, message: message || "Failed to fetch profile" };
                }

                setProfile(await res.json());
            } catch (err: any) {
                console.error(err);

                const status = err?.status;
                const message =
                    err?.message || "Failed to load profile (network or server error).";

                setError(status ? `(${status}) ${message}` : message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    const toggleFollow = useCallback(() => {
        setProfile((prev) =>
            prev ? { ...prev, isFollowing: !prev.isFollowing } : prev
        );
    }, []);

    return { profile, loading, error, toggleFollow, };
}