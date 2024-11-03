"use client" // This line makes this component a client component
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { strategyLikes, StrategyType } from "../types"
import { generateSlug } from "../utils"
import Loader from "../loader"

const LikedStrategies = () => {
  const [likedStrategies, setLikedStrategies] = useState<strategyLikes[]>([])
  const [loading, setLoading] = useState(true)

  // Function to fetch liked strategies from the API
  const fetchLikedStrategies = async () => {
    const response = await fetch("/api/userLikedStrats")

    if (response.ok) {
      const data = await response.json()
      console.log(data.user.strategyLikes)

      const sortedStrategies = data.user.strategyLikes.sort(
        (a: strategyLikes, b: strategyLikes) =>
          new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime()
      )

      console.log(sortedStrategies) // Check if sorted correctly
      setLikedStrategies(sortedStrategies)
      setLoading(false)
    } else {
      console.error("Failed to fetch liked strategies")
    }
  }

  useEffect(() => {
    // Fetch updated liked strategies when component mounts
    fetchLikedStrategies()
  }, [])

  return (
    <div>
      {loading ? (
        <div className="min-h-[calc(100vh-6.25rem)] flex justify-center items-center -mt-14">
          <Loader />
        </div>
      ) : (
        <div>
          {likedStrategies?.length > 0 ? (
            <div className="grid gap-6 w-full 2xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 lg:w-4/6 p-4">
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
                      <p>Description: {strategy.strategy.description}</p>
                      <p>
                        Created:{" "}
                        {formatDistanceToNow(
                          new Date(strategy.strategy.createdAt),
                          {
                            addSuffix: true,
                          }
                        )}
                      </p>
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
            <div className="flex flex-col justify-center items-center min-h-screen -mt-40">
              <div
                className="text-gray-600 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">
                  You haven't liked any strats yet.
                </strong>
              </div>
              <p className="mt-4 text-gray-600">
                <Link href="/" className="text-primary">
                  Click here {""}
                </Link>
                to browse through community shared strats!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LikedStrategies
