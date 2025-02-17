import  prisma  from '@/lib/prisma'
import { NextResponse } from 'next/server'

async function GET() {
  try {
    const plugins = await prisma.plugin.findMany({
      where: {
        enabled: true
      }
    });
    return NextResponse.json(plugins);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching plugins' }, { status: 500 });
  }
}

async function POST(request) {
  try {
    const json = await request.json();
    const plugin = await prisma.plugin.create({
      data: {
        name: json.name,
        description: json.description,
        config:json.config,
        type:json.type,
        enabled: true,
      }
    });
    return NextResponse.json(plugin);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating plugin',error:error.message }, { status: 500 });
  }
}

module.exports = { GET, POST };
