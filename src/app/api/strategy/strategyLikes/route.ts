import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/options"
import { getServerSession } from "next-auth"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const stratIdParam = url.searchParams.get("stratId")
  const likedParam = url.searchParams.get("liked")
  const session = await getServerSession(authOptions)

  const stratIdStr = Array.isArray(stratIdParam)
    ? stratIdParam[0]
    : stratIdParam
  const stratIdInt = parseInt(stratIdStr, 10)

  if (isNaN(stratIdInt)) {
    return NextResponse.json({ error: "Invalid strategy ID" }, { status: 400 })
  }

  if (!session?.user.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    )
  }

  try {
    // Toggle like or unlike based on `likedParam`
    if (likedParam === "true") {
      // Unlike (delete entry from UserStrategyLike)
      await prisma.userStrategyLike.deleteMany({
        where: {
          userId: session.user.id,
          strategyId: stratIdInt,
        },
      })
    } else {
      // Like (create entry in UserStrategyLike)
      await prisma.userStrategyLike.create({
        data: {
          userId: session.user.id,
          strategyId: stratIdInt,
          likedAt: new Date(),
        },
      })
    }

    // Fetch the strategy data to return
    const strategy = await prisma.strategy.findUnique({
      where: { id: stratIdInt },
      include: {
        players: { include: { steps: true } },
        createdBy: true,
        comments: { include: { author: true } },
        strategyLikes: true,
      },
    })

    if (!strategy) {
      return NextResponse.json({ error: "No strategy found" }, { status: 404 })
    }

    return NextResponse.json(strategy, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch strategy" },
      { status: 500 }
    )
  }
}
