interface SinglePostDto {
    id: number;
    imageUrl: string;
    createdAt: string;
    description: string;
    userId: number;
    username: string;
    profileImageUrl: string | null;
}

interface PostsProps {
    posts: SinglePostDto[];
    loading: boolean;
    error: string;
}

export default function PostsGreed({ posts, loading, error }: PostsProps) {
    if (loading) {
        return (
            <p className="text-center mt-10 text-gray-500">
                Loading posts...
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-center mt-10 text-red-500">
                {error}
            </p>
        );
    }
    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="bg-gray-200 rounded-2xl shadow-lg shadow-black/40 overflow-hidden"
                >
                    <img
                        src={`http://localhost:8080/images/${post.imageUrl}`}
                        alt="post"
                        className="w-full aspect-[4/3] object-cover"
                    />
                </div>
            ))}
        </div>
    )
}
