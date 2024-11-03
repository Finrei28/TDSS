"use client"
import Link from "next/link"

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Oops! Page not found.</p>
      <button
        onClick={() => window.history.go(-1)}
        className="px-6 py-3 mb-4 text-primary bg-gray-200 rounded hover:bg-gray-300"
      >
        Go Back
      </button>
      <Link href="/" className="text-primary underline">
        Return to Home
      </Link>
    </div>
  )
}
