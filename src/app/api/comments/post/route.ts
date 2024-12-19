import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/options"
import { getServerSession } from "next-auth"

export async function POST(req: Request) {
  const url = new URL(req.url)
  const stratIdParam = url.searchParams.get("stratId")
  const session = await getServerSession(authOptions)
  const stratIdStr = Array.isArray(stratIdParam)
    ? stratIdParam[0]
    : stratIdParam
  const stratIdInt = parseInt(stratIdStr, 10)

  if (!session?.user.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    )
  }

  try {
    const { content, parentCommentId } = await req.json()

    const result = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        strategyId: stratIdInt,
        parentCommentId: parentCommentId ? parseInt(parentCommentId, 10) : null, // Set parentCommentId if it exists
      },
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    )
  }
}
