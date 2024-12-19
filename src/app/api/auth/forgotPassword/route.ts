import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import { sendEmail } from "@/components/Email/send"

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ message: "Reset link sent to email" }) // Intentional to void showing what emails are in the database
  }

  // Generate a reset token and expiration (1 hour from now)
  const resetPasswordToken = uuidv4()
  const resetPasswordTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  // Update user with the token and expiration date
  await prisma.user.update({
    where: { email },
    data: { resetPasswordToken, resetPasswordTokenExpiresAt },
  })

  // Send the reset link (replace this with your email service)
  const resetUrl = `${
    process.env.NEXTAUTH_URL
  }/reset-password?token=${resetPasswordToken}&email=${encodeURIComponent(
    email
  )}`

  const subject = "Reset Password"

  const html = `
        <html>
          <body>
            <p>We've received a request to reset your password. Click on the following link to reset your password: ${resetUrl}</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Best regards,</p>
            <p><strong>TDSS</strong></p>
          </body>
        </html>
      `

  sendEmail(email, subject, html)

  return NextResponse.json({ message: "Reset link sent to email" })
}
