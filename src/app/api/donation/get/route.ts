import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user.id) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 })
  }
  try {
    const data = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        donations: true,
      },
    })

    return NextResponse.json(data?.donations, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
