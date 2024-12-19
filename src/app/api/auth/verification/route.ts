// src/app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/404`)
  }

  // Verify the token in your database
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpiresAt: { gt: new Date() },
    },
  })

  if (!user) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/404`)
  }

  // Mark the user as verified
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
      verificationTokenExpiresAt: null,
    },
  })

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/register/success`)
}
