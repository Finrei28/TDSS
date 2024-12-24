"use client"
import { getSession, signIn } from "next-auth/react"
import React, { Suspense, useState } from "react"
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
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { SubmitButton } from "@/components/SubmitButton"
import SignInVerification from "@/components/SignInVerification"
import { EyeOff, Eye } from "lucide-react"
import ForgotPassword from "@/components/ForgotPassword"
import Loader from "@/components/loader"

const FormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

function SignIn() {
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
  const [isFormLoading, setIsFormLoading] = useState(false) // For regular sign-in
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [verify, setVerify] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setError(null)
    setIsFormLoading(true)
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    setIsFormLoading(false)
    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        setError("Incorrect email or password")
      } else {
        setError("Please try again later")
      }
      return
    }

    // Check if the user requires 2FA
    const updatedSession = await getSession()
    const requires2FAExpiresAt = updatedSession?.user?.requires2FAExpiresAt

    if (!requires2FAExpiresAt || requires2FAExpiresAt < new Date()) {
      setVerify(true)
      setEmail(data.email)
      setPassword(data.password)
      const dataForm = { email: data.email }
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      })
      if (response.status === 404) {
        router.replace("/404")
      }
      if (response.ok) {
        setLoading(false)
      }
    } else {
      router.push(callbackUrl) // Redirect to the callback URL on success
    }
  }

  const handleSignIn = async () => {
    setIsGoogleLoading(true) // Start loading
    try {
      // Perform Google sign-in
      await signIn("google", { callbackUrl: callbackUrl })
    } catch (error) {
      setError(
        "Could not sign in with google, please try again later. If this persists, please contact the admin"
      )
    } finally {
      setIsGoogleLoading(false) // End loading after sign-in
    }
  }

  const handleForgotPassword = () => {
    setForgotPassword((prev) => !prev)
    setError(null)
    form.reset()
  }

  return (
    <div className="bg-primary">
      {verify ? (
        <SignInVerification
          email={email}
          password={password}
          loading={loading}
        />
      ) : (
        <section className="flex justify-center items-center  min-h-[calc(100vh-3.5rem)]">
          <MaxWidthWapper className="max-w-lg">
            {forgotPassword ? (
              <ForgotPassword handleForgotPassword={handleForgotPassword} />
            ) : (
              <div className="flex flex-col justify-center items-center w-full bg-white rounded-md p-6 shadow-lg border border-gray-200">
                <div className="mb-10 md:mb-16">
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
                            <Input
                              placeholder="Email"
                              type="email"
                              {...field}
                            />
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
                          <div className="relative flex items-center justify-center">
                            <FormControl className="py-5">
                              <Input
                                placeholder="Password"
                                type={`${showPassword ? "text" : "password"}`}
                                {...field}
                              />
                            </FormControl>
                            <div
                              className="absolute right-3 cursor-pointer "
                              onClick={() => setShowPassword((prev) => !prev)}
                            >
                              {showPassword ? (
                                <Eye size={"1.25rem"} />
                              ) : (
                                <EyeOff size={"1.25rem"} />
                              )}
                            </div>
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className="text-primary text-sm mb-2 cursor-pointer hover:underline"
                        onClick={handleForgotPassword}
                      >
                        Forgot password{" "}
                      </div>
                      <div className=" text-gray-600 text-sm mb-5">
                        Don't have an account?{" "}
                        <Link
                          href="/register"
                          className="text-blue-500 hover:underline"
                        >
                          Create one now!
                        </Link>
                      </div>

                      {error && (
                        <p className="text-red-500 mb-4 text-center">{error}</p> // Error message displayed here
                      )}
                      <SubmitButton label="Sign In" isLoading={isFormLoading} />
                    </div>
                  </form>
                </Form>
                <div className="mt-2 mb-2 text-gray-600 text-sm">or</div>
                <div className="flex flex-col w-2/3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault() // Prevent default form submission behavior
                      handleSignIn() // Trigger Google sign-in on button click
                    }}
                  >
                    <SubmitButton
                      label="Sign In with Google"
                      isLoading={isGoogleLoading}
                      logo="./googleIcon.svg"
                      alt="Google Logo"
                    />
                  </form>
                </div>
              </div>
            )}
          </MaxWidthWapper>
        </section>
      )}
    </div>
  )
}

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-3.5rem)] flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <SignIn />
    </Suspense>
  )
}

export default page
