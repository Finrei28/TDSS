"use client"
import React, { useEffect, useState } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SubmitButton } from "@/components/SubmitButton"
import { Button } from "./ui/button"

const FormSchema = z.object({
  email: z.string().email("Invalid email"),
})

type ForgotPasswordProps = {
  handleForgotPassword: () => void
}

const ForgotPassword = ({ handleForgotPassword }: ForgotPasswordProps) => {
  const [error, setError] = useState<string | null>(null)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [resent, setResent] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(0)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setError(null)
    setIsFormLoading(true)
    await fetch("/api/auth/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    })
    setIsFormLoading(false)
    setSent(true)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else if (timer === 0) {
      setResent(false)
    }
    return () => clearInterval(interval) // Cleanup the interval on component unmount
  }, [resent, timer])

  const handleResendClick = async () => {
    setError(null)
    setIsFormLoading(true)
    const email = form.getValues().email
    await fetch("/api/auth/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setIsFormLoading(false)
    setResent(true)
    setTimer(30)
  }

  return (
    <div className="flex flex-col justify-center items-center w-full bg-white rounded-md p-6 shadow-lg border border-gray-200">
      <div className="mb-10 md:mb-16">
        <h1 className="flex justify-center tracking-tight text-balance font-bold!leading-tight text-gray-900 text-3xl md:text-4xl ">
          Forgot password
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl className="py-5">
                  <Input
                    placeholder="Email"
                    type="email"
                    {...field}
                    disabled={sent}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-center justify-center space-y-5">
            {error && (
              <p className="text-red-500 mb-4 text-center">{error}</p> // Error message displayed here
            )}
            {!sent ? (
              <SubmitButton label="Send link" isLoading={isFormLoading} />
            ) : (
              <Button
                onClick={handleResendClick}
                type="button"
                disabled={resent}
                className={`w-full 
                ${resent && "bg-gray-500 cursor-not-allowed"}`}
              >
                {" "}
                {resent ? `Resend in ${timer}s` : "Resend Email"}{" "}
              </Button>
            )}

            <div
              className="text-primary text-sm cursor-pointer hover:underline"
              onClick={handleForgotPassword}
            >
              Back to sign in
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ForgotPassword
