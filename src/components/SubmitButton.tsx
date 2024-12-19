"use client"

import { Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"

type SubmitButtonProps = {
  label: string
  logo?: string
  alt?: string
  isLoading: boolean
}

export function SubmitButton({
  label,
  logo,
  alt,
  isLoading,
}: SubmitButtonProps) {
  return (
    <>
      {isLoading ? (
        <Button disabled variant="outline" className="w-full">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please wait...
        </Button>
      ) : (
        <Button variant={logo ? "outline" : "default"} className="w-full">
          {logo && alt && (
            <Image
              src={logo}
              alt={alt}
              width={16}
              height={16}
              className="w-4 h-4 mr-2"
            />
          )}
          {label}
        </Button>
      )}
    </>
  )
}
