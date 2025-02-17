import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Get single post
async function GET(request, { params }) {
  try {
    const post = await prisma.installPlugin.findUnique({
      where: {
        id: params.id,
      },
      include: {
        plugin: true
      }
    });
    if (!post) {
      return NextResponse.json({ error: "install Plugin not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}


async function PUT(request, {params} ){
  try{
    const json = await request.json();
    const post = await prisma.plugin.update({
      where: {
        id: params.id,
      },
      data: {
        title: json.title,
        description: json.description,
        content: json.content
      }
    })

  }catch (error) {
    return NextResponse.json({ error: "Error updating post",error:error.message}, { status: 500 });
  }

}


module.exports = { GET };