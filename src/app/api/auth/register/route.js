import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    console.log(name,email,password);
    
    const exists = await prisma.user.findUnique({
      where: {
        email
      }
    });
   console.log("found",exists);
    if (exists) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    console.log(hashedPassword,"password");
   
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER' // Default role
      }
    });




    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating user',error : error.message},
      { status: 500 }
    );
  }
}

module.exports = { POST };
