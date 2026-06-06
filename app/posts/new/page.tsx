"use client";

import { createPost } from "@/actions/posts";

async function createPostAction(formData: FormData): Promise<void> {
  await createPost(formData);
}

export default function NewPostPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Create New Post
      </h1>

      <form action={createPostAction} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full border p-3"
        />

        <textarea
          name="body"
          placeholder="Write your blog..."
          rows={10}
          className="w-full border p-3"
        />

        <input
          type="text"
          name="tags"
          placeholder="react,nextjs,typescript"
          className="w-full border p-3"
        />

        <button
          className="bg-black text-white px-5 py-2 rounded"
        >
          Publish
        </button>
      </form>
    </div>
  );
}