// app/api/register/route.ts

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const userData = await request.json()
  const { email, username, password } = userData
  console.log(email, username, password)
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email, username },
  })
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    )
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  })

  return NextResponse.json({ user }, { status: 201 })
}
