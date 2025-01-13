import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
  }

  try {
    const donationData = await req.json()

    const paymentIntent = await stripe.paymentIntents.retrieve(
      donationData.paymentIntent
    )
    const paymentMethod = await stripe.paymentMethods.retrieve(
      paymentIntent.payment_method as string
    )

    const donation = await prisma.donation.create({
      data: {
        amount: parseInt(donationData.amount),
        userId: donationData.userId,
        paymentMethod: paymentMethod.type,
      },
    })

    return NextResponse.json(donation, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
