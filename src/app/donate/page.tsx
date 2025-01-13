"use client"
import React from "react"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import { Button } from "@/components/ui/button"
import Checkout from "@/components/Donation/Checkout"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const page = () => {
  const [selectedAmount, setSelectedAmount] = React.useState("custom")
  const [inputValue, setInputValue] = React.useState("")
  const amounts = ["1", "5", "10", "20", "50", "custom"]
  const [checkout, setCheckout] = React.useState(false)
  const [amount, setAmount] = React.useState(0)
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("Stripe publishable key is not defined!")
  }

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  )

  const handleAmountChange = (amount: string) => {
    setSelectedAmount(amount)
    setAmount(parseInt(amount))
  }

  return (
    <div className="bg-slate-50 flex justify-center items-center  min-h-[calc(100vh-3.5rem)]">
      <MaxWidthWapper className="sm:max-w-screen-sm">
        <div className="bg-white flex flex-col items-center gap-5 justify-center rounded-md p-6 shadow-lg">
          {!checkout ? (
            <>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold!leading-tight text-gray-900">
                  Donation!
                </h1>
                <p className="text-sm text-gray-600">
                  We appreciate any amount of donation!
                </p>
                <p className="text-sm text-gray-600">
                  Donations are non-refundable
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 font-bold">
                {amounts.map((amount, index) => (
                  <div
                    key={index}
                    onClick={() => handleAmountChange(amount)}
                    className={`px-4 py-2 rounded-md text-center bg-slate-50 border-2 cursor-pointer ${
                      amount === selectedAmount
                        ? "border-black"
                        : "border-transparent text-gray-600"
                    }`}
                  >
                    <div>{amount === "custom" ? amount : `$${amount}`}</div>
                  </div>
                ))}
              </div>
              {selectedAmount === "custom" && (
                <input
                  type="text"
                  value={inputValue ? `$${inputValue}` : ""}
                  onChange={(e) => {
                    const value =
                      e.target.value.charAt(0) === "$"
                        ? e.target.value.slice(1)
                        : e.target.value
                    if (
                      /^\d*$/.test(value) &&
                      value.length <= 6 &&
                      !value.startsWith("0")
                    ) {
                      setInputValue(value) // Only set if the value is digits
                      setAmount(parseInt(value))
                    }
                  }}
                  placeholder="How much would you like to donate?"
                  className="w-full max-w-80 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              )}
              {((selectedAmount && selectedAmount !== "custom") ||
                inputValue) && (
                <Button onClick={() => setCheckout(true)}>
                  Donate $
                  {selectedAmount === "custom" ? inputValue : selectedAmount}
                </Button>
              )}
            </>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: amount * 100, // convert amount to cents
                currency: "usd",
              }}
            >
              <Checkout amount={amount} />
            </Elements>
          )}
        </div>
      </MaxWidthWapper>
    </div>
  )
}

export default page
