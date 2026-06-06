import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const post = await db.post.findUnique({
            where: { id: params.id },
            include: {
                author: true,
                tags: true,
                likes: true,
            },
        });


        if (!post) {
            return NextResponse.json(
                { success: false, error: "post nahi mile" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: post }
        )

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "post fetch karne mein error" },
            { status: 500 }
        );
    }
}


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { title, postBody, published, tags } = body;

        const post = await db.post.update({
            where: { id: params.id },
            data: {
                ...(title && { title }),
                ...(postBody && { body: postBody }),
                ...(published !== undefined && { published }),
                ...(tags && {
                    set: [],
                    connectOrCreate: tags.map((tag: string) => ({
                        where: { name: tag },
                        create: { name: tag },
                    })),
                })
            },
            include: {
                author: true,
                tags: true
            },
        });

        return NextResponse.json({ success: true, data: post })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "post update karne mein error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request:NextRequest, {params} :{params: {id:string}}){
    try {
        await db.post.delete({
            where:{id:params.id},
        });

        return NextResponse.json({
            success:true,
            message:"Post delete ho gaya",
        });
    } catch (error) {
        return NextResponse.json(
            {success:false,error:"post delete karne mein error"},
            {status:500}
        )
    }
}