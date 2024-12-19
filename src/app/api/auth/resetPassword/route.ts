import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  const { token, email, password } = await request.json()

  if (!token || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    )
  }

  // Check if the user exists and the token is valid
  const user = await prisma.user.findUnique({ where: { email } })

  if (
    !user ||
    user.resetPasswordToken !== token ||
    !user.resetPasswordTokenExpiresAt ||
    user.resetPasswordTokenExpiresAt < new Date()
  ) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    )
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Update the user's password and clear the token fields
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
    },
  })

  return NextResponse.json({ message: "Password has been reset successfully" })
}
