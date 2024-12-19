import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const url = new URL(req.url)

  const stratIdParam = url.searchParams.get("stratId")

  const stratIdStr = Array.isArray(stratIdParam)
    ? stratIdParam[0]
    : stratIdParam

  const stratIdInt = parseInt(stratIdStr, 10)

  if (isNaN(stratIdInt)) {
    return NextResponse.json({ error: "Invalid strategy ID" }, { status: 400 })
  }

  try {
    // Find the strategy by mapName, gamemode, and strategy ID
    const strategy = await prisma.strategy.findFirst({
      where: {
        id: stratIdInt,
      },
      include: {
        players: {
          include: {
            steps: true,
          },
        },
        map: true,
      },
    })
    if (!strategy) {
      return NextResponse.json({ error: "No strategy found" }, { status: 404 })
    }
    const modifiedStrategy = {
      ...strategy,
      numOfPlayer: (() => {
        switch (strategy.numOfPlayer) {
          case "ONE":
            return "1"
          case "TWO":
            return "2"
          case "THREE":
            return "3"
          default:
            return "4" // Handle other cases or assume "4" as the default
        }
      })(),
    }
    return NextResponse.json(modifiedStrategy, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch strategy" },
      { status: 500 }
    )
  }
}
