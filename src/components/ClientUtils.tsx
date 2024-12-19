"use client"
import { useState } from "react"

export const ErrorMessageProps = () => {
  const [error, setError] = useState<string | null>(null)
  const closeErrorMessage = () => setError(null)

  return { error, setError, closeErrorMessage }
}
