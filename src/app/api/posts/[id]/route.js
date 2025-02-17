import  prisma  from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Get single post
async function GET(request, { params }) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: params.id
      },
      include: {
        plugins: {
          include: {
            plugin: true // This includes the full plugin details
          }
        },
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 });
  }
}

// Update post
async function PUT(request, { params }) {
  try {
    const json = await request.json();
    const post = await prisma.post.update({
      where: {
        id: params.id
      },
      data: {
        title: json.title,
        slug: json.slug,
        content: json.content
      }
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 });
  }
}

// Delete post
async function DELETE(request, { params }) {
  try {
    await prisma.post.delete({
      where: {
        id: params.id
      }
    });
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 });
  }
}

module.exports = { GET, PUT, DELETE };
