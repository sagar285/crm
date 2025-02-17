// app/api/posts/plugins/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

 async function POST(request) {
  try {
    const json = await request.json();
    
    if (!json.postId || !json.pluginId) {
      return NextResponse.json(
        { error: "postId and pluginId are required" },
        { status: 400 }
      );
    }

    // Check if plugin exists and is enabled
    const plugin = await prisma.plugin.findUnique({
      where: {
        id: json.pluginId,
        enabled: true
      }
    });

    if (!plugin) {
      return NextResponse.json(
        { error: "Plugin not found or is disabled" },
        { status: 404 }
      );
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: {
        id: json.postId
      }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if plugin is already added to post
    const existingPostPlugin = await prisma.postPlugins.findUnique({
      where: {
        postId_pluginId: {
          postId: json.postId,
          pluginId: json.pluginId
        }
      }
    });

    if (existingPostPlugin) {
      return NextResponse.json(
        { error: "Plugin already added to this post" },
        { status: 400 }
      );
    }

    // Add plugin to post
    await prisma.postPlugins.create({
      data: {
        postId: json.postId,
        pluginId: json.pluginId
      }
    });

    // Check and create installation if needed
    const installation = await prisma.installPlugin.findUnique({
      where: {
        userId_pluginId: {
          userId: existingPost.authorId,
          pluginId: json.pluginId
        }
      }
    });

    if (!installation) {
      await prisma.installPlugin.create({
        data: {
          userId: existingPost.authorId,
          pluginId: json.pluginId
        }
      });
    }

    // Get updated post with all plugins
    const updatedPost = await prisma.post.findUnique({
      where: { 
        id: json.postId 
      },
      include: {
        plugins: {
          include: {
            plugin: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Plugin added successfully",
      post: updatedPost
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: "Error updating post", details: error.message },
      { status: 500 }
    );
  }
}

// Add a DELETE endpoint to remove plugins from posts
 async function DELETE(request) {
  try {
    const json = await request.json();
    
    if (!json.postId || !json.pluginId) {
      return NextResponse.json(
        { error: "postId and pluginId are required" },
        { status: 400 }
      );
    }

    await prisma.postPlugins.delete({
      where: {
        postId_pluginId: {
          postId: json.postId,
          pluginId: json.pluginId
        }
      }
    });

    const updatedPost = await prisma.post.findUnique({
      where: { 
        id: json.postId 
      },
      include: {
        plugins: {
          include: {
            plugin: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Plugin removed successfully",
      post: updatedPost
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: "Error removing plugin", details: error.message },
      { status: 500 }
    );
  }
}

module.exports ={POST,DELETE}