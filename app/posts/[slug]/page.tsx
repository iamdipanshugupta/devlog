import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await db.post.findUnique({
    where: { slug },
    include: {
      author: true,
      tags: true,
      likes: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">
        {post.title}
      </h1>

      <p className="text-gray-500 mb-4">
        By {post.author.name}
      </p>

      <div className="flex gap-2 mb-6">
        {post.tags.map((tag) => (
          <span
            key={tag.id}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            #{tag.name}
          </span>
        ))}
      </div>

      <p className="leading-8">
        {post.body}
      </p>

      <div className="mt-6">
        ❤️ {post.likes.length} Likes
      </div>
    </div>
  );
}