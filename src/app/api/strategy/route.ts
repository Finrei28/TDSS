import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const mapParam = url.searchParams.get("mapName")
  const gamemodeParam = url.searchParams.get("gamemode")?.toUpperCase()
  const stratIdParam = url.searchParams.get("stratId")

  // Ensure mapName and stratId are strings
  const mapNameStr = Array.isArray(mapParam) ? mapParam[0] : mapParam
  const gamemodeStr = Array.isArray(gamemodeParam)
    ? gamemodeParam[0]
    : gamemodeParam
  const stratIdStr = Array.isArray(stratIdParam)
    ? stratIdParam[0]
    : stratIdParam

  const originalMapName = mapNameStr?.replace(/-/g, " ") // Replace hyphens with spaces
  const stratIdInt = parseInt(stratIdStr, 10)

  if (isNaN(stratIdInt)) {
    return NextResponse.json({ error: "Invalid strategy ID" }, { status: 400 })
  }

  try {
    // Find the strategy by mapName, gamemode, and strategy ID
    const strategy = await prisma.strategy.findFirst({
      where: {
        id: stratIdInt,
        map: { name: originalMapName },
        gamemode: gamemodeStr,
      },
      include: {
        players: {
          include: {
            steps: true,
          },
        },
        createdBy: true,
        comments: {
          include: {
            author: true,
          },
        },
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
