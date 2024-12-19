// app/api/strategies/[mapName].ts

import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const mapParam = url.searchParams.get("mapName")
  const gamemodeParam = url.searchParams.get("gamemode")?.toUpperCase()
  // Ensure mapName is a string
  const mapNameStr = Array.isArray(mapParam) ? mapParam[0] : mapParam
  const gamemodeStr = Array.isArray(gamemodeParam)
    ? gamemodeParam[0]
    : gamemodeParam
  const originalMapName = mapNameStr?.replace(/-/g, " ") // Replace hyphens with spaces
  const map = await prisma.map.findFirst({
    where: { name: originalMapName },
  })

  try {
    const strategies = await prisma.strategy.findMany({
      where: { map: { name: originalMapName }, gamemode: gamemodeStr },
      include: {
        createdBy: true,
      },
    })

    return NextResponse.json({ strategies, map }, { status: 200 })
  } catch (error) {
    return NextResponse.json(map, { status: 500 })
  }
}
