import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get single post
async function GET(request, { params }) {
  try {
    const post = await prisma.plugin.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}

// Update post
async function PUT(request, { params }) {
  try {
    const json = await request.json();
    const post = await prisma.plugin.update({
      where: {
        id: params.id,
      },
      data: {
        name: json.name,
        description: json.description,
        config: json.config,
        type:json.type,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}

// Delete post
async function DELETE(request, { params }) {
  try {
    await prisma.plugin.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({ message: "Plugin deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting plugins",error:error.message }, { status: 500 });
  }
}

async function POST(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const plugin = await prisma.plugin.findUnique({
        where: {
          id: params.id,
        },
      });
  
      if (!plugin) {
        return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
      }
  
    //   Check if plugin is already installed
    const existingInstallation = await prisma.installPlugin.findFirst({
        where: {
          pluginId: plugin.id,
          userId: session.user.id,
        },
      });
      
      if (existingInstallation) {
        return NextResponse.json(
          { error: "Plugin already installed" },
          { status: 400 }
        );
      }
      
      
      if (existingInstallation) {
        return NextResponse.json(
          { error: "Plugin already installed" },
          { status: 400 }
        );
      }
      
  
      const installPlugin = await prisma.installPlugin.create({
        data: {
          pluginId: plugin.id,
          userId: session.user.id,
        },
      });
  
      return NextResponse.json(installPlugin);
    } catch (error) {
      console.error('Installation error:', error);
      return NextResponse.json(
        { error: "Error installing plugin", details: error.message },
        { status: 500 }
      );
    }
  }

module.exports = { GET, PUT, DELETE,POST };
