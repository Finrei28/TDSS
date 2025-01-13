import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    const session = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
    })

    return NextResponse.json(
      { clientSecret: session.client_secret },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
