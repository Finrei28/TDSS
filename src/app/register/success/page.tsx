"use client"
import React from "react"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import Link from "next/link"

// Define your validation schema

export default function VerificationSuccess() {
  return (
    <div className="bg-primary">
      <section className="min-h-[calc(100vh-3.5rem)] flex justify-center items-center">
        <MaxWidthWapper className="md:max-w-screen-sm">
          <div className="flex flex-col justify-center items-center bg-slate-50 md:bg-white rounded-md p-6 shadow-lg border border-gray-200">
            <div className="mb-10 md:mb-20 flex flex-col items-center justify-center">
              <h1 className="flex justify-center tracking-tight text-balance font-bold!leading-tight text-gray-900 text-3xl md:text-4xl text-center">
                You have successfully verified your email
              </h1>
              <p className="mt-10">
                You may now{" "}
                <Link href="/signin" className="text-primary underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </MaxWidthWapper>
      </section>
    </div>
  )
}
