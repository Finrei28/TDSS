import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma" // Adjust import path as necessary
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        strategyLikes: {
          include: {
            strategy: {
              include: {
                map: true,
              },
            },
          },
        },
      },
    })
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
