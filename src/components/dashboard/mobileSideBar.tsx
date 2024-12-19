"use client"

import React, { useState } from "react"
import { PanelRightOpen, PanelRightClose } from "lucide-react"
import Link from "next/link"

const MobileSideBar = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev)
  }

  return (
    <div className="relative sm:hidden">
      {/* Panel Icon for Mobile */}
      <button
        onClick={togglePanel}
        className={`fixed top-1/2 transform -translate-y-1/2 z-50 p-2 ${
          isPanelOpen ? "bg-white" : "bg-primary"
        } rounded-full shadow-md transition-all duration-300 ${
          isPanelOpen ? "right-[320px]" : "right-1"
        }`}
        aria-label="Toggle Panel"
      >
        {isPanelOpen ? (
          <PanelRightClose size={24} color="black" />
        ) : (
          <PanelRightOpen size={24} color="white" />
        )}
      </button>

      {/* Panel Drawer */}
      <div
        className={`bg-primary fixed right-0 h-full w-80 z-10 text-white px-4 py-6 text-xl transform transition-transform duration-300 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Dashboard Menu</h2>
          <ul className="mt-10 space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="block hover:text-primary hover:bg-white p-2 rounded-lg"
                onClick={togglePanel}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/mystrats"
                className="block hover:text-primary hover:bg-white p-2 rounded-lg"
                onClick={togglePanel}
              >
                My Strats
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/likedstrats"
                className="block hover:text-primary hover:bg-white p-2 rounded-lg"
                onClick={togglePanel}
              >
                Liked Strats
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MobileSideBar
