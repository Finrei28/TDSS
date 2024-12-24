"use client"
import React, { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { StrategyType } from "@/components/types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { generateSlug } from "@/components/utils"
import { ErrorMessageProps } from "@/components/ClientUtils"
import { ErrorMessage } from "@/components/ui/MessageBox"
import { useSession } from "next-auth/react"
import Loader from "@/components/loader"

const myStrats = () => {
  // Fetch the session
  const { data: session, status } = useSession()

  if (status === "unauthenticated") {
    redirect("/api/auth/signin?callbackUrl=/dashboard/mystrats")
  }

  const { error, setError, closeErrorMessage } = ErrorMessageProps()
  const [strategies, setStrategies] = useState<StrategyType[] | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch data for strategies

  useEffect(() => {
    const getMyStrategies = async () => {
      try {
        const response = await fetch("/api/strategy/myStrategies")
        const result = await response.json()
        setStrategies(result)
        setLoading(true)
      } catch (error) {
        setError("Could not load your strategies")
      }
    }
    getMyStrategies()
  }, [])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-row">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-5 bg-gray-100 sm:ml-64">
          <div className="fixed bottom-4 ml-4 p-4 z-110">
            {error && (
              <ErrorMessage
                message={error}
                closeErrorMessage={closeErrorMessage}
              />
            )}
          </div>
          <h2 className="text-xl md:text-3xl font-semibold text-gray-700 mb-6">
            My Strats
          </h2>

          {loading ? (
            <div className="min-h-[calc(100vh-6.25rem)] flex justify-center items-center -mt-14">
              <Loader />
            </div>
          ) : (
            <>
              {strategies && strategies.length > 0 ? (
                <div className="grid justify-center sm:justify-start gap-6 p-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(300px,0fr))] lg:grid-cols-[repeat(auto-fit,minmax(300px,0fr))]">
                  {strategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      className="relative rounded-lg shadow-lg overflow-hidden bg-white flex flex-col"
                    >
                      {strategy.map?.image && (
                        <div className="relative w-full h-64">
                          <Image
                            src={strategy.map.image}
                            alt={strategy.map.name || "Map Image"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6 flex-grow">
                        <h3 className="text-2xl font-bold text-gray-700 mb-4">
                          {strategy.name}
                        </h3>
                        <div className="mt-2 text-md font-bold text-gray-400">
                          <p>Map: {strategy.map?.name}</p>
                          <p>Gamemode: {strategy.gamemode}</p>
                          {strategy.inGameGamemode && (
                            <p>In Game Difficulty: {strategy.inGameGamemode}</p>
                          )}
                          <p>
                            Players required:{" "}
                            {strategy.numOfPlayer === "ONE"
                              ? 1
                              : strategy.numOfPlayer === "TWO"
                              ? 2
                              : strategy.numOfPlayer === "THREE"
                              ? 3
                              : 4}
                          </p>
                          <p>Difficulty: {strategy.difficulty}</p>
                          <p>Description: {strategy.description}</p>
                          {strategy.createdAt && (
                            <p>
                              Created:{" "}
                              {formatDistanceToNow(
                                new Date(strategy.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-center gap-5 m-5">
                        <Link
                          href={`/dashboard/mystrats/edit/${strategy.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full px-8 py-2" type="button">
                            Edit
                          </Button>
                        </Link>
                        <Link
                          href={`/${strategy.gamemode.toLowerCase()}/${generateSlug(
                            strategy.map?.name
                          )}/Strat/${strategy.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full px-8 py-2" type="button">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center min-h-screen -mt-40 mr-5 ml-2">
                  <div
                    className="text-gray-600 px-4 py-3 rounded relative text-center"
                    role="alert"
                  >
                    <strong className="font-bold">
                      You haven't posted any strategies to the community yet.
                    </strong>
                  </div>
                  <p className="mt-4 text-gray-600 text-center">
                    <Link href="/createstrategy" className="text-primary">
                      Click here
                    </Link>{" "}
                    to start sharing your strategy and help others!
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default myStrats
