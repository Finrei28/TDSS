"use client"
import { signIn } from "next-auth/react"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import { useSearchParams, useRouter } from "next/navigation"
import { SubmitButton } from "@/components/SubmitButton"
import Loader from "@/components/loader"

// Define your validation schema
const FormSchema = z.object({
  code: z.string().min(1, "Verification Code is required"),
})

type VerificationProps = {
  email: string
  password: string
  loading: boolean
}

export default function Verification({
  email,
  password,
  loading,
}: VerificationProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isFormLoading, setIsFormLoading] = useState(false) // For regular sign-in

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setError(null)
    setIsFormLoading(true)
    const response = await fetch("/api/auth/verify/verifyCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: data.code }),
    })
    setIsFormLoading(false)
    const result = await response.json()
    if (result.success) {
      const signInResponse = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false, // Don't redirect immediately
      })
      if (signInResponse?.error) {
        setError("Authentication failed. Please try again.")
      } else {
        router.push(callbackUrl)
      }
    } else {
      setError(result.error || "Invalid or Expired Code")
    }
  }

  return (
    <section className="flex justify-center items-center  min-h-[calc(100vh-3.5rem)] ">
      {loading ? (
        <Loader />
      ) : (
        <MaxWidthWapper className="max-w-lg">
          <div className="flex flex-col justify-center items-center w-full bg-white rounded-md p-6 shadow-lg border border-gray-200">
            <div className="mb-16">
              <h1 className="flex justify-center tracking-tight text-balance font-bold!leading-tight text-gray-900 text-3xl md:text-4xl text-center">
                Enter the Verification Code sent to your email
              </h1>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter your code:</FormLabel>
                      <FormControl className="py-5">
                        <Input
                          placeholder="Verification Code"
                          type="code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col items-center justify-center">
                  {error && (
                    <p className="text-red-500 mb-4">{error}</p> // Error message displayed here
                  )}
                  <SubmitButton label="Verify" isLoading={isFormLoading} />
                </div>
              </form>
            </Form>
          </div>
        </MaxWidthWapper>
      )}
    </section>
  )
}
