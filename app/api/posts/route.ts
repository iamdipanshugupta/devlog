import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// get 

export async function GET() {
    try {
        const posts = await db.post.findMany({
            include: {
                author: true,
                tags: true,
                likes: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            success: true,
            data: posts
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "posts ffetcj karene mein error" },
            { status: 500 }
        );
    }
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, slug, body: psotBody, authorId, tags } = body;
        
        if(!title || !slug || !authorId) {
            return NextResponse.json(
                {success:false ,error:"title,slug,body ,authorId are required"},
                {status:400}
            );
        }

        const post = await db.post.create({
            data:{
                title,
                slug,
                body:psotBody,
                authorId,
                tags:{
                    connectOrCreate: tags?.map((tag: string) => ({
                        where: {name:tag},
                        create: {name:tag},
                    })) ?? [],
                },
            },
            include:{
                author:true,
                tags:true
            },
        });

        return NextResponse.json(
            {success:true , data:post},
            {status:201}
        );
    } catch (error) {
        return NextResponse.json(
            {sucess:false , error:"post bananae mein error"},
            {status:500}
        )
    }
}