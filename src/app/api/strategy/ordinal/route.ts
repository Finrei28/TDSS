import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get("userId")

  // Ensure mapName and stratId are strings
  const userIdStr = Array.isArray(userId) ? userId[0] : userId

  try {
    // Find the strategy by mapName, gamemode, and strategy ID
    const userStrategies = await prisma.strategy.findMany({
      where: { userId: userIdStr }, // Make sure to use the actual user ID here
      orderBy: { createdAt: "asc" }, // Order strategies by createdAt, or any other field
      select: { id: true }, // Only select the ID field
    })
    if (!userStrategies) {
      return NextResponse.json({ error: "No strategy found" }, { status: 404 })
    }

    return NextResponse.json(userStrategies, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch strategy" },
      { status: 500 }
    )
  }
}
