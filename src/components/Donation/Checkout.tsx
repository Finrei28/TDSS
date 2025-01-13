"use client"
import React, { useEffect, useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { ErrorMessageProps } from "@/components/ClientUtils"
import Loader from "../loader"
import { useSession } from "next-auth/react"

const Checkout = ({ amount }: { amount: number }) => {
  const { data: session } = useSession()
  const [paymentLoading, setPaymentLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState("")
  const { error, setError, closeErrorMessage } = ErrorMessageProps()
  useEffect(() => {
    fetch("api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [amount])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPaymentLoading(true)
    closeErrorMessage()
    sessionStorage.removeItem("donationPosted")

    if (!stripe || !elements) {
      return
    }

    const { error: submitError } = await elements.submit()

    if (submitError && submitError.message) {
      setError(submitError.message)
      setPaymentLoading(false)
      return
    }
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${
          process.env.NEXT_PUBLIC_URL
        }/payment-success?payment_success=success&donation_amount=${amount}${
          session?.user.id ? `&userId=${session?.user.id}` : ""
        }`,
      },
    })

    if (error && error?.message) {
      setError(error.message)
    }

    setPaymentLoading(false)
  }

  return (
    <div>
      <h1 className="flex justify-center font-bold">
        You're donating ${amount}!
      </h1>
      {!stripe || !elements || !clientSecret ? (
        <div className="flex justify-center p-6">
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {clientSecret && <PaymentElement />}
          {error && (
            <p className="text-red-500 mb-4 mt-4 text-center">{error}</p>
          )}
          <div className="flex justify-center mt-5">
            <Button className="w-full" disabled={paymentLoading}>
              {!paymentLoading ? (
                `Donate $${amount}`
              ) : (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                  processing...
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Checkout
