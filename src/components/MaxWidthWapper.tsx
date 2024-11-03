import { cn } from "@/lib/utils"
import React from "react"

type MaxWidthWapperProps = {
  className?: string
  children: React.ReactNode
}

const MaxWidthWapper = ({ className, children }: MaxWidthWapperProps) => {
  return (
    <div
      className={cn("h-full mx-auto w-full max-w-screen-xl px-3 ", className)}
    >
      {children}
    </div>
  )
}

export default MaxWidthWapper
