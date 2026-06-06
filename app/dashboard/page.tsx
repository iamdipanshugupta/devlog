import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import PostActions from "../components/post-actions";
import type { Prisma } from "@prisma/client";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {

  type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    tags: true;
    likes: true;
  };
}>;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const posts: PostWithRelations[] = await db.post.findMany({
  where: { authorId: session.user.id },
  include: { tags: true, likes: true },
  orderBy: { createdAt: "desc" },
});

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, {session.user.name}</p>
        </div>
        <Link
          href="/posts/new"
          className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg">Abhi koi post nahi hai</p>
          <Link href="/posts/new" className="text-sky-400 hover:underline mt-2 inline-block">
            Pehla post likho →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-white">{post.title}</h2>
                  <div className="flex gap-3 mt-2 text-sm text-slate-400">
                    <span>❤️ {post.likes.length} likes</span>
                    <span>
                      {post.published ? (
                        <span className="text-green-400">● Published</span>
                      ) : (
                        <span className="text-yellow-400">● Draft</span>
                      )}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {post.tags.map((tag) => (
                      <span key={tag.id} className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Client Component — toast + confirm dialog ke saath */}
                <PostActions postId={post.id} published={post.published} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}