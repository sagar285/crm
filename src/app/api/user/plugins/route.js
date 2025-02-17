// app/api/user/plugins/route.js
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const installedPlugins = await prisma.installPlugin.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        plugin: true
      }
    })

    return NextResponse.json(installedPlugins)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching plugins" ,error:error.message}, { status: 500 })
  }
}