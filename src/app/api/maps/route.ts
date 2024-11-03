// /src/app/api/maps/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Import the Gamemode enum
import { Gamemode } from "@prisma/client" // Adjust this import according to your project structure

export async function GET(req: Request) {
  const url = new URL(req.url)
  const gamemodeParam = url.searchParams.get("gamemode") // Get gamemode from query string
  const mapName = url.searchParams.get("name")
  try {
    // Prepare gamemode for query
    const gamemode = gamemodeParam
      ? (gamemodeParam.toUpperCase() as Gamemode)
      : undefined // Cast the string to Gamemode
    if (mapName) {
      const map = await prisma.map.findUnique({
        where: {
          name: mapName,
        },
      })
      if (!map) {
        return NextResponse.json({ error: "Map not found" }, { status: 404 })
      }
      return NextResponse.json(map, { status: 200 })
    }
    // If gamemode is provided, filter maps based on it
    const maps = gamemode
      ? await prisma.map.findMany({
          where: {
            gamemodes: {
              has: gamemode, // Use the 'has' operator to filter
            },
          },
        })
      : await prisma.map.findMany() // If no gamemode, return all maps

    return NextResponse.json(maps, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch maps" }, { status: 500 })
  }
}
