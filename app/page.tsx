import { db } from "@/lib/db";
import PostCard from "./components/post-card";

export const revalidate = 30;

export default async function HomePage() {
  const posts = await db.post.findMany({
    where: {
      published: true,  
    },
    include: {
      author: true,
      tags: true,
      likes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-white mb-2">DevLog</h1>
        <p className="text-slate-400">Developers ke liye, developers ke dwara</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-500 text-center py-20">Abhi koi published post nahi hai</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}