"use client";

import Link from "next/link";
import { toggleLike } from "@/actions/posts";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type Post = {
  id: string;
  title: string;
  slug: string;
  body: string;
  createdAt: Date;
  author: { name: string | null };
  tags: { id: string; name: string }[];
  likes: { userId: string }[];
};

export default function PostCard({ post }: { post: Post }) {
  const { data: session } = useSession();

  const isLiked = session?.user?.id
    ? post.likes.some((l) => l.userId === session.user.id)
    : false;

  async function handleLike() {
    if (!session?.user?.id) {
      toast.error("Like karne ke liye login karo");
      return;
    }
    const result = await toggleLike(post.id, session.user.id);
    if (result.success) {
      toast.success(result.liked ? "Liked! ❤️" : "Like hataya");
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-slate-500 transition-colors">
      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-xl font-semibold text-white hover:text-sky-400 transition-colors">
          {post.title}
        </h2>
      </Link>

      <p className="text-slate-400 text-sm mt-1">
        by {post.author.name} •{" "}
        {new Date(post.createdAt).toLocaleDateString("en-IN")}
      </p>

      <p className="text-slate-300 text-sm mt-3 line-clamp-2">{post.body}</p>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
            isLiked
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "border border-slate-600 text-slate-400 hover:border-red-500/50 hover:text-red-400"
          }`}
        >
          {isLiked ? "❤️" : "🤍"} {post.likes.length}
        </button>
      </div>
    </div>
  );
}