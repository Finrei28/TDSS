import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { PlayerData, PlayerSteps } from "@/components/Types"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function PATCH(req: NextRequest) {
  const stratId = req.nextUrl.pathname.split("/").pop()
  const { data, playerId, playerStep, numberOfPlayers } = await req.json()
  // Ensure mapName and stratId are strings
  const stratIdStr = Array.isArray(stratId) ? stratId[0] : stratId
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    )
  }

  try {
    // Find the strategy by mapName, gamemode, and strategy ID
    let updatedData = null
    if (playerId) {
      const updatedPlayer = await prisma.player.update({
        where: { id: playerId },
        data: {
          towers: data.towers, // Update towers
          consumables: data.consumables, // Update consumables
          steps: {
            update: data.steps
              ?.filter((step: PlayerData) => step.id)
              .map((step: PlayerData) => ({
                where: { id: step.id }, // Update existing steps by their ID
                data: {
                  waveStart: step.waveStart,
                  waveEnd: step.waveEnd,
                  description: step.description,
                },
              })),
            create: data.steps
              ?.filter((step: PlayerData) => !step.id)
              .map((step: PlayerData) => ({
                waveStart: step.waveStart,
                waveEnd: step.waveEnd,
                description: step.description,
                playerId: playerId, // Make sure to associate the new step with the player
              })),
          },
        },
        include: {
          steps: true, // Include updated steps in the response
        },
      })
      updatedData = updatedPlayer
    } else if (playerStep) {
      const updatedStrategy = await prisma.strategy.update({
        where: { id: parseInt(stratIdStr) },
        data: {
          numOfPlayer:
            numberOfPlayers === "1"
              ? "ONE"
              : numberOfPlayers === "2"
              ? "TWO"
              : numberOfPlayers === "3"
              ? "THREE"
              : "FOUR",
          players: {
            create: {
              playerNo: playerStep.playerNo,
              consumables: playerStep.consumables.filter((c: string) => c), // Filter to remove null/undefined
              towers: playerStep.towers,
              steps: {
                create: playerStep.steps.map((step: PlayerData) => ({
                  waveStart: step.waveStart,
                  waveEnd: step.waveEnd,
                  description: step.description,
                })),
              },
            },
          },
        },
        include: {
          players: {
            include: {
              steps: true, // Include steps for newly created player
            },
          },
        },
      })

      updatedData = updatedStrategy // Assign the updated strategy with the new player
    } else {
      const updateData: any = {
        ...(data.name && { name: data.name }),
        ...(data.gamemode && { gamemode: data.gamemode }),
        ...(data.difficulty && { difficulty: data.difficulty }),
        ...(data.description && { description: data.description }),
        ...(data.numOfPlayer && { numOfPlayer: data.numOfPlayer }),
        ...(data.inGameGamemode && { inGameGamemode: data.inGameGamemode }),
      }
      console.log(updateData)
      const updatedStrategy = await prisma.strategy.update({
        where: { id: parseInt(stratIdStr) },
        data: updateData,
      })
      updatedData = updatedStrategy
    }

    if (!updatedData) {
      return NextResponse.json({ error: "No strategy found" }, { status: 404 })
    }

    return NextResponse.json(updatedData, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch strategy" },
      { status: 500 }
    )
  }
}
