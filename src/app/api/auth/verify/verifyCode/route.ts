// app/api/register/route.ts

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../[...nextauth]/options"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const data = await request.json()
  const { email, code } = data

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (!existingUser) {
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 404 }
    )
  }

  if (!code) {
    return NextResponse.json(
      { message: "Verification code is required" },
      { status: 400 }
    )
  }

  if (
    existingUser.otp !== code ||
    (existingUser.otpExpiresAt && existingUser.otpExpiresAt < new Date())
  ) {
    return NextResponse.json(
      { message: "Invalid or expired verification code" },
      { status: 400 }
    )
  }
  const twoDaysFromNow = new Date()
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2)
  await prisma.user.update({
    where: { email },
    data: {
      otp: null,
      otpExpiresAt: null,
      requires2FAExpiresAt: twoDaysFromNow,
    },
  })

  return NextResponse.json({ success: true })
}
