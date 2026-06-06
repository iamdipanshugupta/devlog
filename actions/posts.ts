"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const tagsRaw = formData.get("tags") as string;

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const post = await db.post.create({
    data: {
      title,
      body,
      slug,
      published: true,
      authorId: session.user.id,
      tags: {
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/dashboard");

  redirect(`/posts/${post.slug}`);
}

export async function deletePost(id: string) {
    try {
        await db.like.deleteMany({ where: { postId: id } })

        await db.post.delete({ where: { id } })

        revalidatePath("/")
        revalidatePath("/dashboard")

        return { success: true, message: "Post delete ho gaya" }
    } catch (error) {
        return { success: false, error: "Delete karne mein error aaya" };
    }
}

export async function toggleLike(postId: string, userId: string) {
    try {
        const existingLike = await db.like.findUnique({
            where: {
                userId_postId: { userId, postId },
            },
        });

        if (existingLike) {
            await db.like.delete({
                where: {
                    userId_postId: { userId, postId }
                },
            });
            revalidatePath("/")
            return { success: true, liked: false };
        }
        else {
            await db.like.create({
                data: { userId, postId }
            });

            revalidatePath("/")
            return { success: true, liked: true };
        }
    } catch {
        return { success: false, error: "Like mein error aaya" };
    }
}



export async function togglePublish(id: string, currentStatus: boolean) {
    try {
        const post = await db.post.update({
            where: { id },
            data: { published: !currentStatus },
        });

        revalidatePath("/");
        revalidatePath("/dashboard");

        return { success: true, published: post.published };
    } catch (error) {
        return { success: false, error: "Publish karne mein error aaya" };
    }
}