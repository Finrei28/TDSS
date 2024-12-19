// app/api/register/route.ts

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { authenticator } from "otplib"
import { sendEmail } from "@/components/Email/send"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const secret = authenticator.generateSecret() // Generate a secret
  const otp = authenticator.generate(secret) // Generate OTP
  const data = await request.json()
  const { email } = data
  const user = await prisma.user.update({
    where: { email },
    data: {
      otp: otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  })
  const subject = "Your TDSS Verification Code"
  const html = `
        <html>
          <body>
            <strong>Your Verification code is ${otp}</strong><p>It will expire in 10 minutes.</p>
            <p>Best regards,</p>
            <p><strong>TDSS</strong></p>
          </body>
        </html>
      `

  await sendEmail(email, subject, html)

  return NextResponse.json({ user }, { status: 201 })
}
