import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Turtle } from "lucide-react"

export async function GET(req: Request) {
  try {
    const strategies = await prisma.strategy.findMany({
      orderBy: {
        strategyLikes: {
          _count: "desc", // Order by like count
        },
      },
      take: 5, // Get the top 5
      select: {
        id: true,
        name: true,
        gamemode: true,
        map: true,
        numOfPlayer: true,
        difficulty: true,
        createdBy: true,
        createdAt: true,
        inGameGamemode: true,
        _count: {
          select: { strategyLikes: true }, // Include like count in the response
        },
      },
    })
    return NextResponse.json(strategies, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch strategies" },
      { status: 500 }
    )
  }
}
