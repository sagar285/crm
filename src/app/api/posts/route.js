// app/api/posts/route.ts
import  prisma  from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

// Get all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}

// Create post
export async function POST(request) {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  
    try {
      const json = await request.json()
      const post = await prisma.post.create({
        data: {
          title: json.title,
          slug: json.slug,
          content: json.content,
          authorId: session.user.id // Add author
        }
      })
      return NextResponse.json(post)
    } catch (error) {
      return NextResponse.json({ error: 'Error creating post',error:error.message }, { status: 500 })
    }
  }