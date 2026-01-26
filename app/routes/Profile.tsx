import { useParams, useNavigate, NavLink } from "react-router-dom";
import Posts from "~/components/Posts";
import { useProfile } from "~/hooks/useProfile";
import { usePosts } from "~/hooks/usePosts";
import { toggleFollow as toggleFollowApi } from "~/api/follow.api";
import ButtonVibeon from "~/components/ButtonVibeon";


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
    const { posts, loading: postsLoading, error: postsError, updatePost, deletePost } = usePosts(`/api/posts/user/${username}`);

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
            alert(`Error (${err?.status ?? "?"}): ${err?.message ?? "Request failed"}`);
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
                        <NavLink to={`/chat/${profile.username}`} className="bg-vibeon hover:bg-vibeon-hover mouse-pointer py-2 px-4 text-white font-bold text-md rounded-xl">Message</NavLink>
                        <ButtonVibeon onClick={handleToggleFollow} name={profile.isFollowing ? "Unfollow" : "Follow"} />
                    </div>
                ) : (
                    <ButtonVibeon name="Logout" onClick={handleLogout} />
                )}
            </div>

            <Posts posts={posts} loading={postsLoading} error={postsError} onPostUpdated={updatePost} onPostDeleted={deletePost} />
        </div >
    );
}