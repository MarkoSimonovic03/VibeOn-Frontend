import { useState } from "react";
import { createPost } from "~/api/posts.api";

export default function CreatePost() {
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!image) {
            setError("Image is required");
            return;
        }

        try {
            const data = await createPost(description, image);
            console.log("Created post:", data);

            setDescription("");
            setImage(null);
            setSuccess("Post successfully created!");
        } catch (err: any) {
            setError(err?.message || "Failed to create post");
        }
    };


    return (
        <>
            <div className="min-w-md mx-auto mt-10 bg-gray-300 p-6 rounded-2xl shadow h-fit">
                <h2 className="text-xl font-bold mb-4 text-center">Create post</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Post description..."
                        className="w-full border rounded-lg p-3 bg-gray-100"
                        rows={4}
                        required
                    />

					<label className="flex items-center justify-center bg-vibeon py-2 w-full rounded-lg text-white cursor-pointer">
					Choose the image
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="hidden"
						required
					/>
					</label>

					<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded-lg"
					>
					Post
					</button>

                </form>
            </div>
        </>
    );
}
