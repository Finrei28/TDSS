import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const stratIdParam = url.searchParams.get("stratId")
  const parentIdParam = url.searchParams.get("parentId")

  // Parse strategy ID
  const stratIdStr = Array.isArray(stratIdParam)
    ? stratIdParam[0]
    : stratIdParam
  const stratIdInt = parseInt(stratIdStr, 10)
  if (isNaN(stratIdInt)) {
    return NextResponse.json({ error: "Invalid strategy ID" }, { status: 400 })
  }

  // Parse parent comment ID if provided
  const parentIdStr = Array.isArray(parentIdParam)
    ? parentIdParam[0]
    : parentIdParam
  const parentIdInt = parentIdStr ? parseInt(parentIdStr, 10) : null
  if (parentIdInt && isNaN(parentIdInt)) {
    return NextResponse.json(
      { error: "Invalid parent comment ID" },
      { status: 400 }
    )
  }

  try {
    // Determine the query conditions based on the presence of parentId
    const whereCondition = parentIdInt
      ? { strategyId: stratIdInt, parentCommentId: parentIdInt } // Fetch replies for a specific comment
      : { strategyId: stratIdInt, parentCommentId: null } // Fetch top-level comments

    const comments = await prisma.comment.findMany({
      where: whereCondition,
      include: {
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(comments, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}
