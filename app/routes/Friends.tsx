import Posts from '../components/Posts'
import { usePosts } from '~/hooks/usePosts';

export default function Friends() {
    const { posts, loading, error, updatePost, deletePost } = usePosts("http://localhost:8080/api/posts/followeePosts");

    return (
        <Posts posts={posts} loading={loading} error={error} onPostUpdated={updatePost} onPostDeleted={deletePost} />
    )
}