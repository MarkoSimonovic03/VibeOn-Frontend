import { useParams, useNavigate } from "react-router-dom";
import Posts from "~/components/Posts";
import { useProfile } from "~/hooks/useProfile";
import { usePosts } from "~/hooks/usePosts";
import { toggleFollow as toggleFollowApi } from "~/api/follow.api";


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


export default function Profile() {
    const { username } = useParams();
    const { profile, loading: profileLoading, error: profileError, toggleFollow: toggleFollowLocal } = useProfile(username);
    const { posts, loading: postsLoading, error: postsError, updatePost, deletePost } = usePosts(`http://localhost:8080/api/posts/user/${username}`);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    };

    const handleToggleFollow = async () => {
        if (!profile) return;
        toggleFollowLocal();

        try {
            await toggleFollowApi(profile.id);
        } catch (err: any) {
            toggleFollowLocal();
            console.error(err);

            const status = err?.status;
            const message =
                err?.message || "Failed to toggle follow (network or server error).";

            alert(status ? `(${status}) ${message}` : message);
        }
    };


    if (profileLoading) return <p className="p-8">Loading...</p>;
    if (profileError) return <p className="p-8 text-red-500">{profileError}</p>;
    if (!profile) return null;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-start justify-between  mb-8">
                <div className="flex gap-6 items-center">
                    <img src={`http://localhost:8080/images/${profile.profileImageUrl}`} alt="profile" className="w-32 h-32 rounded-full object-cover border-2 border-gray-600" />

                    <div>
                        <h1 className="text-3xl font-bold">{profile.username}</h1>
                        <p className="text-gray-600">{profile.name} {profile.lastName}</p>
                        <p className="text-sm text-gray-500">Joined: {profile.createdAt}</p>
                    </div>
                </div>

                {localStorage.getItem('username') !== profile.username ? (
                    <div className="flex gap-2 mt-2">
                        <a href={`/chat/${profile.username}`} className="bg-vibeon py-2 px-4 text-white font-bold text-md rounded-xl">Message</a>
                        <button onClick={handleToggleFollow} className="bg-vibeon py-2 px-4 text-white font-bold text-md rounded-xl">{profile.isFollowing ? "Unfollow" : "Follow"}</button>
                    </div>
                ) : (
                    <button onClick={handleLogout} className="bg-vibeon py-2 px-4 text-white font-bold text-md rounded-xl" >Logout </button>
                )}
            </div>

            <Posts posts={posts} loading={postsLoading} error={postsError} onPostUpdated={updatePost} onPostDeleted={deletePost} />
        </div >
    );
}