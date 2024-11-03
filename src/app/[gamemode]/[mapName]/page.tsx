// app/special/[mapName]/page.tsx

"use client"
import { useEffect, useState } from "react"
import { notFound, useParams, useRouter } from "next/navigation" // Get the dynamic route parameter
import { PlayerSteps } from "@/components/types"
import Loader from "@/components/loader"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import Link from "next/link"
import { StrategyType } from "@/components/types"

const MapStrategiesPage = () => {
  const { mapName, gamemode } = useParams() // Fetch mapName from the dynamic route
  const [strategies, setStrategies] = useState<StrategyType[]>([])
  const [loading, setLoading] = useState(true)
  const mapNameStr = Array.isArray(mapName) ? mapName[0] : mapName
  const gamemodeStr = Array.isArray(gamemode) ? gamemode[0] : gamemode
  const originalMapName = mapNameStr?.replace(/-/g, " ")
  const router = useRouter()
  useEffect(() => {
    const fetchStrategies = async () => {
      if (
        gamemodeStr !== "hardcore" &&
        gamemodeStr !== "special" &&
        gamemodeStr !== "normal"
      ) {
        router.push("/404")
      }
      try {
        const mapResponse = await fetch(`/api/maps?name=${originalMapName}`)
        if (mapResponse.status === 404) {
          router.replace("/404")
          return
        }

        const url = new URL("/api/strategies", window.location.origin)
        url.searchParams.append("mapName", mapNameStr) // Append gamemode as a query parameter
        url.searchParams.append("gamemode", gamemodeStr)
        const response = await fetch(url.toString()) // Make the request
        const data = await response.json()
        setStrategies(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching strategies:", error)
      }
    }

    fetchStrategies()
  }, [mapName])

  const getNumberOfPlayers = (strategy: StrategyType) => {
    switch (strategy.numOfPlayer) {
      case "ONE":
        return "1"
      case "TWO":
        return "2"
      case "THREE":
        return "3"
      case "FOUR":
        return "4"
      default:
        return undefined
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen -mt-14">
      <section>
        <MaxWidthWapper>
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <Loader />
            </div>
          ) : (
            <div>
              <div className="flex justify-center pt-20 pb-10">
                <h1 className="relative w-fit tracking-tight text-balance font-bold !leading-tight text-gray-900 text-xl md:text-2xl lg:text-3xl">
                  Strategies for{" "}
                  <span
                    className={`${
                      gamemodeStr === "normal"
                        ? "text-green-500"
                        : gamemodeStr === "special"
                        ? "text-orange-400"
                        : "text-purple-600"
                    }`}
                  >
                    {originalMapName}
                  </span>
                </h1>
              </div>

              <div>
                {strategies.length > 0 ? (
                  strategies.map((strategy) => (
                    <Link
                      key={strategy.id}
                      className="flex flex-col border rounded-lg p-4 bg-white border-r-8 border-gray-500 hover:border-gray-300 text-gray-500"
                      href={`/${gamemodeStr}/${mapName}/Strat/${strategy.id}`}
                    >
                      <h2 className="flex justify-center text-lg text-black">
                        {strategy.name}
                      </h2>
                      <p>
                        Number of Players required:{" "}
                        {getNumberOfPlayers(strategy)}
                      </p>
                      <p>Strategy Difficulty: {strategy.difficulty}</p>
                      <p>Gamemode: {strategy.gamemode}</p>
                      {strategy.inGameGamemode && (
                        <p>In Game Difficulty: {strategy.inGameGamemode}</p>
                      )}
                      {strategy.description && (
                        <p>Description/Notes: {strategy.description}</p>
                      )}
                      <div className="flex flex-row justify-end">
                        <p>By: {strategy.createdBy?.username}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col justify-center items-center min-h-screen -mt-40">
                    <p>
                      No strategies available for{" "}
                      <span
                        className={`${
                          gamemodeStr === "normal"
                            ? "text-green-500"
                            : gamemodeStr === "special"
                            ? "text-orange-400"
                            : "text-purple-600"
                        }`}
                      >
                        {gamemodeStr.toUpperCase()}{" "}
                      </span>
                      {originalMapName}
                    </p>
                    <p>Have one in mind?</p>
                    <Link href="/createstrategy" className="text-primary">
                      Share it now!
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </MaxWidthWapper>
      </section>
    </div>
  )
}

export default MapStrategiesPage
