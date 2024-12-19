// app/api/register/route.ts

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { sendEmail } from "@/components/Email/send"
import crypto from "crypto"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const userData = await request.json()
  const { email, username, password } = userData
  console.log({ email, username, password })
  // Check if user already exists
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  })
  const existingUsername = await prisma.user.findFirst({
    where: { username },
  })
  if (existingUsername) {
    return NextResponse.json(
      { message: "Username already exists" },
      { status: 400 }
    )
  }

  if (existingEmail) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 400 }
    )
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)
  const token = crypto.randomBytes(32).toString("hex")
  const expiration = new Date()
  expiration.setHours(expiration.getHours() + 1)

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      verificationToken: token,
      verificationTokenExpiresAt: expiration,
    },
  })
  const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verification?token=${token}`
  const subject = "Verify your email"

  const html = `
        <html>
          <body>
            <p>Please click on the following link to complete your registration: ${verificationLink}</p>
            <p>Best regards,</p>
            <p><strong>TDSS</strong></p>
          </body>
        </html>
      `

  await sendEmail(email, subject, html)

  return NextResponse.json({ user }, { status: 201 })
}
