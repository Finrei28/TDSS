"use client"
import React, { Suspense, useEffect, useState } from "react"
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
import { SubmitButton } from "@/components/SubmitButton"
import { EyeOff, Eye } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import { ErrorMessageProps } from "@/components/ClientUtils"
import { SuccessMessage, ErrorMessage } from "@/components/ui/MessageBox"
import Loader from "@/components/Loader"

const FormSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm your password"),
})

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { error, setError, closeErrorMessage } = ErrorMessageProps()

  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.replace("/signin") // Redirect to the login page if no token is found
    }
  }, [token, router])

  if (!token) {
    return null // Render nothing while redirecting
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (data.password !== data.confirmPassword) {
      setFormError("Passwords do not match")
      return
    }
    setIsFormLoading(true)

    setFormError("")

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, password: data.password }),
    })

    const result = await res.json()
    setIsFormLoading(false)

    if (res.ok) {
      setSuccessMessage("Password has been reset successfully!")
      router.push("/signin")
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="bg-primary">
      {(error || successMessage) && (
        <div className="fixed bottom-4 ml-4 p-4 z-110">
          {error ? (
            <ErrorMessage
              message={error}
              closeErrorMessage={closeErrorMessage}
            />
          ) : successMessage !== null ? (
            <SuccessMessage message={successMessage} />
          ) : null}
        </div>
      )}
      <section className="flex justify-center items-center  min-h-[calc(100vh-3.5rem)]">
        <MaxWidthWapper className="max-w-lg">
          <div className="flex flex-col justify-center items-center w-full bg-white rounded-md p-6 shadow-lg border border-gray-200">
            <div className="mb-10 md:mb-16">
              <h1 className="flex justify-center tracking-tight text-balance font-bold!leading-tight text-gray-900 text-3xl md:text-4xl ">
                Reset Password
              </h1>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <div className="relative flex items-center justify-center">
                        <FormControl className="py-5">
                          <Input
                            placeholder="Password"
                            type={`${
                              showConfirmPassword ? "text" : "password"
                            }`}
                            {...field}
                          />
                        </FormControl>
                        <div
                          className="absolute right-3 cursor-pointer "
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        >
                          {showConfirmPassword ? (
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

                {formError && (
                  <p className="text-red-500 mb-4 text-center">{formError}</p> // Error message displayed here
                )}
                <SubmitButton
                  label="Reset password"
                  isLoading={isFormLoading}
                />
              </form>
            </Form>
          </div>
        </MaxWidthWapper>
      </section>
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
      <ResetPassword />
    </Suspense>
  )
}

export default page
