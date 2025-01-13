"use client"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import React, { useEffect, useState } from "react"
import { CircleCheck } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Loader from "@/components/loader"

const page = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentSuccess = searchParams.get("payment_success")
  const donationAmount = searchParams.get("donation_amount")
  const paymentIntent = searchParams.get("payment_intent")
  const userId = searchParams.get("userId")
  const [loading, setLoading] = useState(true)

  if (paymentSuccess !== "success" || !donationAmount) {
    router.replace("/404")
    return
  }

  useEffect(() => {
    const donationPosted = sessionStorage.getItem("donationPosted")
    if (donationPosted) {
      // If already posted, skip posting again
      setLoading(false)
      return
    }
    const postDonation = async () => {
      if (paymentSuccess === "success" || paymentIntent) {
        if (userId) {
          const donationData = { amount: donationAmount, paymentIntent, userId }
          const res = await fetch(`api/donation/post`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(donationData),
          })
          if (res.ok) {
            sessionStorage.setItem("donationPosted", "true")
            setLoading(false)
          }
        }
      }
    }

    if (userId) {
      postDonation()
    }
  }, [paymentSuccess, donationAmount, paymentIntent, userId])

  return (
    <div className="bg-slate-50 flex justify-center items-center  min-h-[calc(100vh-3.5rem)]">
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <>
          <MaxWidthWapper className="sm:max-w-screen-sm">
            <div className="bg-white flex flex-col items-center gap-5 justify-center rounded-md p-10 shadow-lg">
              <CircleCheck color="green" size={"3rem"} />
              <h1 className="font-bold font-siz">
                Thank you for your donating ${donationAmount}!
              </h1>
              {session?.user.id && (
                <p>
                  You can see all your donations on your dashboard or by
                  clicking{" "}
                  <Link
                    href={`/dashboard/donations`}
                    className="text-blue-500 hover:underline"
                  >
                    here
                  </Link>
                </p>
              )}

              <Link href="/" className="text-blue-500 hover:underline">
                Go back to Home
              </Link>
            </div>
          </MaxWidthWapper>
        </>
      )}
    </div>
  )
}

export default page
