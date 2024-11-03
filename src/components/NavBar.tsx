"use client"

import React from "react"
import MaxWidthWapper from "./MaxWidthWapper"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { CircleUserRound } from "lucide-react"
import { usePathname } from "next/navigation"

const NavBar = () => {
  const currentPath = usePathname()
  const { data: session, status } = useSession()

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWapper className="max-w-none">
        <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold ml-2">
            <img src="/logo.png" alt="logo" className="h-12 w-auto" />
          </Link>
          <div className="h-full flex items-center space-x-4 mr-2">
            {status === "loading" ? (
              <div className="font-semibold text-gray-400">Loading...</div>
            ) : session ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/addmap"
                    className={buttonVariants({ size: "lg", variant: "ghost" })}
                  >
                    Add Map
                  </Link>
                )}
                <Link
                  href="/donate"
                  className={buttonVariants({ size: "lg", variant: "ghost" })}
                >
                  Donate
                </Link>
                <Link
                  href="/api/auth/signout?callbackUrl=/"
                  className={buttonVariants({ size: "lg", variant: "ghost" })}
                >
                  Logout
                </Link>
                <Link href="/dashboard">
                  <span className="hover:text-primary">
                    <CircleUserRound size={"30px"} cursor={"pointer"} />
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/donate"
                  className={buttonVariants({ size: "lg", variant: "ghost" })}
                >
                  Donate
                </Link>
                <Link
                  href={`/api/auth/signin?callbackUrl=${
                    currentPath === "/signin"
                      ? ""
                      : currentPath === "/register"
                      ? ""
                      : currentPath
                  }`}
                  className={buttonVariants({ size: "lg", variant: "ghost" })}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({ size: "lg", variant: "ghost" })}
                >
                  Register
                </Link>
              </>
            )}
            <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
            <Link
              href="/createstrategy"
              className={buttonVariants({
                size: "lg",
                className: "hidden sm:flex items-center gap-1",
              })}
            >
              Share your strat!
            </Link>
          </div>
        </div>
      </MaxWidthWapper>
    </nav>
  )
}

export default NavBar
