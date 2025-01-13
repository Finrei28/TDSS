"use client"

import React, { useEffect, useRef, useState } from "react"
import MaxWidthWapper from "./MaxWidthWapper"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { CircleUserRound, Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const currentPath = usePathname()
  const { data: session, status } = useSession()
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      isMobileMenuOpen
    ) {
      setIsMobileMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWapper className="max-w-none">
        <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-4">
          {/* Logo */}
          <Link href="/" className="flex z-40 font-semibold">
            <img src="/logo.png" alt="logo" className="h-9" />
          </Link>

          {/* Hamburger Icon for Mobile */}
          <div className="sm:hidden">
            <button onClick={toggleMobileMenu} aria-label="Toggle Menu">
              {isMobileMenuOpen ? (
                <X size={24} className="text-gray-600" />
              ) : (
                <Menu size={24} className="text-gray-600" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex h-full items-center space-x-4">
            {status === "loading" ? (
              <></>
            ) : session?.user.id ? (
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
                      : currentPath === "/payment-success"
                      ? "/"
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={menuRef}
            className="sm:hidden absolute right-0 bg-white border-t border-gray-200 shadow-md"
          >
            <div className="flex flex-col items-center p-4 space-y-2">
              {status === "loading" ? (
                <></>
              ) : session?.user.id ? (
                <>
                  <Link href="/dashboard" onClick={toggleMobileMenu}>
                    <span className="hover:text-primary">
                      <CircleUserRound size={"24px"} cursor={"pointer"} />
                    </span>
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/addmap"
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                      onClick={toggleMobileMenu}
                    >
                      Add Map
                    </Link>
                  )}
                  <Link
                    href="/donate"
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                    onClick={toggleMobileMenu}
                  >
                    Donate
                  </Link>
                  <Link
                    href="/api/auth/signout?callbackUrl=/"
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                    onClick={toggleMobileMenu}
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/donate"
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                    onClick={toggleMobileMenu}
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
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                    onClick={toggleMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                    onClick={toggleMobileMenu}
                  >
                    Register
                  </Link>
                </>
              )}
              <Link
                href="/createstrategy"
                className={buttonVariants({
                  size: "sm",
                  className: "flex items-center gap-1",
                })}
                onClick={toggleMobileMenu}
              >
                Share your strat!
              </Link>
            </div>
          </div>
        )}
      </MaxWidthWapper>
    </nav>
  )
}

export default NavBar
