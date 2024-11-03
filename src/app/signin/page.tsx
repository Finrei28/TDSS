// In your login component
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
import { Button } from "@/components/ui/button"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import Link from "next/link"
import { redirect, useSearchParams, useRouter } from "next/navigation"

// Define your validation schema
const FormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export default function SignIn() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setError(null)
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        setError("Incorrect email or password")
      } else {
        setError("Please try again later")
      }
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="bg-primary">
      <section className="flex justify-center items-center  min-h-[calc(100vh-3.5rem)]">
        <MaxWidthWapper className="max-w-lg">
          <div className="flex flex-col justify-center items-center w-full bg-white rounded-md p-6 shadow-lg border border-gray-200">
            <div className="mb-16">
              <h1 className="flex justify-center tracking-tight text-balance font-bold!leading-tight text-gray-900 text-3xl md:text-4xl ">
                Sign In
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
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl className="py-5">
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="space-x-2 text-gray-600 text-sm mb-5">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-500">
                      Create one!
                    </Link>
                  </div>
                  {error && (
                    <p className="text-red-500 mb-4">{error}</p> // Error message displayed here
                  )}
                  <Button
                    className="flex justify-center items-center"
                    type="submit"
                  >
                    Sign In
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </MaxWidthWapper>
      </section>
    </div>
  )
}
