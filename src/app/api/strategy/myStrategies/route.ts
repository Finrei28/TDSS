import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user.id) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 })
  }

  try {
    const data = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        strategies: {
          include: {
            map: true, // Only include the related `map` data if needed.
          },
        },
      },
    })
    return NextResponse.json(data?.strategies, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch strategies" },
      { status: 500 }
    )
  }
}
