// /app/api/strategy/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma" // Assuming you have a Prisma setup in this path
import { Gamemode, StratDifficulty } from "@prisma/client"
import { PlayerData, PlayerSteps } from "@/components/types"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { authOptions } from "../auth/[...nextauth]/options"
import { getServerSession } from "next-auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
  }

  try {
    const strat = await request.json() // Get the data from the client request
    // 1. Find the map by name
    const map = await prisma.map.findUnique({
      where: { name: strat.map.name },
    })

    if (!map) {
      return NextResponse.json({ error: "Map not found" }, { status: 404 })
    }

    // 2. Create the Strategy
    const strategy = await prisma.strategy.create({
      data: {
        name: strat.name,
        gamemode: strat.gamemode.toUpperCase() as Gamemode,
        difficulty: strat.difficulty.toUpperCase() as StratDifficulty,
        mapId: map.id,
        userId: session.user.id,
        inGameGamemode: strat.inGameGamemode
          ? strat.inGameGamemode.toUpperCase()
          : null,
        numOfPlayer:
          strat.players.length === 1
            ? "ONE"
            : strat.players.length === 2
            ? "TWO"
            : strat.players.length === 3
            ? "THREE"
            : "FOUR",
        description: strat.description ? strat.description : "",
        players: {
          create: strat.players.map((player: PlayerSteps, index: number) => ({
            playerNo: index + 1,
            consumables: player.consumables.filter((c) => c),
            towers: player.towers,
            steps: {
              create: player.steps.map((step: PlayerData) => ({
                waveStart: step.waveStart,
                waveEnd: step.waveEnd,
                description: step.description,
              })),
            },
          })),
        },
      },
    })
    return NextResponse.json(strategy, { status: 201 })
  } catch (error) {
    // Type assertion to check if the error is a known error type
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    } else {
      return NextResponse.json({ error: error }, { status: 400 })
    }
  }
}
