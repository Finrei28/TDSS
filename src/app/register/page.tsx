"use client"
import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
import { useRouter } from "next/navigation"

// Define your validation schema
const FormSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function Register() {
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Use the validated form data
    })

    if (res.ok) {
      console.log(data)
      // Handle successful registration (e.g., redirect)
      router.push("/api/auth/signin")
    } else {
      // Handle error
      console.error("Registration failed")
    }
  }

  return (
    <div className="bg-primary">
      <section className="">
        <MaxWidthWapper className="md:max-w-screen-sm">
          <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center bg-slate-50 md:bg-white rounded-md p-6 shadow-lg border border-gray-200">
            <div className="mb-20 md:mb-32">
              <h1 className="flex justify-center tracking-tight text-balance font-bold!leading-tight text-gray-900 text-3xl md:text-4xl ">
                Create Account
              </h1>
              <p className="text-gray-600 text-sm">
                Create an account to access multiple features
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-3/5 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl className="py-5">
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl className="py-5">
                        <Input
                          placeholder="Confirm Password"
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
                    Already have an account?{" "}
                    <Link href="/api/auth/signin" className="text-blue-500">
                      Sign In
                    </Link>
                  </div>
                  <Button
                    className="flex justify-center items-center"
                    type="submit"
                  >
                    Create Account
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
