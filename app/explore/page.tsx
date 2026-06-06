import { db } from "@/lib/db";
import PostCard from "../components/post-card";
export default async function ExplorePage() {
  const posts = await db.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
      tags: true,
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Explore Blogs</h1>

      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
