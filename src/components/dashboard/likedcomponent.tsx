"use client" // This line makes this component a client component
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { strategyLikes } from "../types"
import { generateSlug } from "../utils"
import { ErrorMessageProps } from "../ClientUtils"
import Loader from "../loader"
import { ErrorMessage } from "../ui/MessageBox"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

const LikedStrategies = () => {
  const { error, setError, closeErrorMessage } = ErrorMessageProps()

  // Function to fetch liked strategies from the API
  const fetchLikedStrategies = async () => {
    const response = await fetch("/api/userLikedStrats")

    if (response.ok) {
      const data = await response.json()
      const sortedStrategies = data.user.strategyLikes.sort(
        (a: strategyLikes, b: strategyLikes) =>
          new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime()
      )

      return sortedStrategies
    } else {
      setError(
        "Could not fetch your liked strategies, please try again later. If this persists please contact the admin."
      )
    }
  }

  const { data: likedStrategies, isLoading } = useQuery<strategyLikes[], Error>(
    {
      queryKey: ["likedstrats"],
      queryFn: () => fetchLikedStrategies(),
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
      cacheTime: 60 * 60 * 1000, // Retain cache for 60 minutes
      refetchInterval: 30 * 1000, // refetch the data every 30 seconds so new data can be fetched
    } as UseQueryOptions<strategyLikes[], Error>
  )

  return (
    <>
      {isLoading ? (
        <div className="min-h-[calc(100vh-13.5rem)] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div>
          <div className="fixed bottom-4 ml-4 p-4 z-110">
            {error && (
              <ErrorMessage
                message={error}
                closeErrorMessage={closeErrorMessage}
              />
            )}
          </div>
          {likedStrategies && likedStrategies?.length > 0 ? (
            <div className="grid justify-center sm:justify-start gap-6 p-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(300px,0fr))] lg:grid-cols-[repeat(auto-fit,minmax(350px,0fr))]">
              {likedStrategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="relative rounded-lg shadow-lg overflow-hidden bg-white flex flex-col"
                >
                  {strategy.strategy.map?.image && (
                    <div className="relative w-full h-64">
                      <Image
                        src={strategy.strategy.map.image} // Replace with your actual image URL
                        alt={strategy.strategy.map.name || "Map Image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">
                      {strategy.strategy.name}
                    </h3>
                    <div className="mt-2 text-md font-bold text-gray-400">
                      <p>Map: {strategy.strategy.map?.name}</p>
                      <p>Gamemode: {strategy.strategy.gamemode}</p>
                      {strategy.strategy.inGameGamemode && (
                        <p>
                          In Game Difficulty: {strategy.strategy.inGameGamemode}
                        </p>
                      )}

                      <p>
                        Players required:{" "}
                        {strategy.strategy.numOfPlayer === "ONE"
                          ? 1
                          : strategy.strategy.numOfPlayer === "TWO"
                          ? 2
                          : strategy.strategy.numOfPlayer === "THREE"
                          ? 3
                          : 4}
                      </p>
                      <p>Difficulty: {strategy.strategy.difficulty}</p>
                      <p>
                        Description:{" "}
                        {strategy.strategy.description &&
                        strategy.strategy.description.length > 99
                          ? strategy.strategy.description?.slice(0, 99) + "..."
                          : strategy.strategy.description}
                      </p>
                      {strategy.strategy.createdAt && (
                        <p>
                          Created:{" "}
                          {formatDistanceToNow(
                            new Date(strategy.strategy.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="m-5">
                    <Link
                      href={`/${strategy.strategy.gamemode.toLowerCase()}/${generateSlug(
                        strategy.strategy.map?.name
                      )}/Strat/${strategy.strategyId}`}
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
                className="text-gray-600 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold text-center">
                  You haven't liked any strats yet.
                </strong>
              </div>
              <p className="mt-4 text-gray-600 text-center">
                <Link href="/" className="text-primary">
                  Click here {""}
                </Link>
                to browse through community shared strats!
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default LikedStrategies
