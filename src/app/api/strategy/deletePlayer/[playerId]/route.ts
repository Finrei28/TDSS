// app/api/playerSteps/[id]/route.ts

import { NextResponse } from "next/server"
import prisma from "@/lib/prisma" // Make sure the path to your Prisma client is correct
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

// DELETE method handler
export async function DELETE(
  request: Request,
  { params }: { params: { playerId: string } }
) {
  const { playerId } = params // Extract ID from the URL params
  const body = await request.json()
  const { stratId, newNumberOfPlayers } = body
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    )
  }
  console.log(params)
  try {
    // Delete the player step using Prisma ORM
    const deletedPlayerStep = await prisma.player.delete({
      where: {
        id: parseInt(playerId), // Ensure ID is parsed if needed (as an integer)
      },
    })

    const updatedNumOfPlayers =
      newNumberOfPlayers === "1"
        ? "ONE"
        : newNumberOfPlayers === "2"
        ? "TWO"
        : newNumberOfPlayers === "3"
        ? "THREE"
        : "FOUR"

    await prisma.strategy.update({
      where: { id: parseInt(stratId) },
      data: {
        numOfPlayer: updatedNumOfPlayers,
      },
    })

    // Return success response
    return NextResponse.json({
      message: "Player step deleted successfully",
      data: deletedPlayerStep,
    })
  } catch (error) {
    console.error("Error deleting player step:", error)
    return NextResponse.json(
      { message: "Error deleting player step" },
      { status: 500 }
    )
  }
}
