import React, { useState } from "react"
import Modal from "@/components/ui/modal"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { PlayerSteps, StrategyType } from "./Types"
import { Button, buttonVariants } from "./ui/button"

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  handleSubmit?: () => void // Add your own submit logic here
  strat?: StrategyType
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  handleSubmit,
  strat,
}: ConfirmationModalProps) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        {!strat ? (
          <div className="flex flex-col justify-center items-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-yellow-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 2a8 8 0 00-8 8v1a8 8 0 0015.76 3.44A8 8 0 0010 2zM2 10a8 8 0 0116 0v1a8 8 0 01-16 0v-1zM9 6h2v5H9V6zm1 10a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <h1 className="text-2xl font-bold">
                Seems like You're not Signed In
              </h1>
            </div>
            <p className="text-center text-gray-700 mb-2">
              Sign in to post your strategy to the community!
            </p>
            <p className="text-center text-gray-500 mb-4">
              Don't worry, your strategy will be here when you come back.
            </p>
            <div className="mt-5">
              <Link
                href="/api/auth/signin?callbackUrl=/createstrategy"
                className={buttonVariants({
                  size: "lg",
                  className: "bg-blue-500 text-white hover:bg-blue-600",
                })}
              >
                Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div>
              <h1 className="flex justify-center text-3xl font-bold">
                Confirmation
              </h1>
              <h2 className="flex justify-center text-base mt-5 mb-5 text-center">
                You're about to create a strategy {strat.name} for{" "}
                {strat.inGameGamemode ? strat.inGameGamemode.toUpperCase() : ""}{" "}
                {strat.map.name.toUpperCase()} in {strat.gamemode.toUpperCase()}{" "}
                mode that requires {strat.numOfPlayer}{" "}
                {strat.numOfPlayer === "1" ? "player" : "players"}
              </h2>
              <div className="flex justify-center gap-3">
                <Button type="button" onClick={handleSubmit}>
                  Yes, submit
                </Button>
                <Button type="button" onClick={onClose}>
                  Never Mind
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default ConfirmationModal
