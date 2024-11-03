// src/app/api/upload/route.ts

import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import prisma from "@/lib/prisma"
import { Difficulty } from "@prisma/client"

// Handle POST request for uploading an image
export async function POST(req: Request) {
  try {
    const { data } = await req.json() // Base64 image string from the request body
    const { name, difficulty, gamemodes } = data.mapValues
    const uploadedResponse = await cloudinary.uploader.upload(
      data.mapValues.base64Image,
      {
        use_filename: true,
        folder: "TDSStrats",
      }
    )
    const imageURL = uploadedResponse.secure_url
    const difficultyMapping: Record<string, Difficulty> = {
      "VERY EASY": Difficulty.VERY_EASY,
      EASY: Difficulty.EASY,
      NORMAL: Difficulty.NORMAL,
      HARD: Difficulty.HARD,
      INSANE: Difficulty.INSANE,
    }

    // Assuming strat.difficulty is the input string, e.g., "VERY EASY"
    const difficultyEnumValue = difficultyMapping[difficulty]
    const newMap = await prisma.map.create({
      data: {
        name,
        image: imageURL,
        difficulty: difficultyEnumValue,
        gamemodes,
      },
    })
    return NextResponse.json(newMap, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
