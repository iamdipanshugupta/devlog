"use client";

import { deletePost, togglePublish } from "@/actions/posts";
import toast from "react-hot-toast";

type Props = {
  postId: string;
  published: boolean;
};

export default function PostActions({ postId, published }: Props) {
  async function handleToggle() {
    const result = await togglePublish(postId, published);
    if (result.success) {
      toast.success(result.published ? "Published! ✅" : "Draft mein gaya");
    }
  }

  async function handleDelete() {
    if (!confirm("Pakka delete karna hai?")) return;
    const result = await deletePost(postId);
    if (result.success) {
      toast.success("Post delete ho gaya");
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleToggle}
        className="text-xs px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:border-sky-500 hover:text-sky-400 transition-colors"
      >
        {published ? "Unpublish" : "Publish"}
      </button>

      <button
        onClick={handleDelete}
        className="text-xs px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:border-red-500 hover:text-red-400 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}