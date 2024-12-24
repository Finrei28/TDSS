// app/special/[mapName]/page.tsx

"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Loader from "@/components/loader"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import Link from "next/link"
import { StrategyType, Map } from "@/components/types"
import { ErrorMessage } from "@/components/ui/MessageBox"
import Image from "next/image"
import { ErrorMessageProps } from "@/components/ClientUtils"
import { ArrowBigLeft } from "lucide-react"

const MapStrategiesPage = () => {
  const { mapName, gamemode } = useParams()
  const [strategies, setStrategies] = useState<StrategyType[]>([])
  const [loading, setLoading] = useState(true)
  const mapNameStr = Array.isArray(mapName) ? mapName[0] : mapName
  const gamemodeStr = Array.isArray(gamemode) ? gamemode[0] : gamemode
  const originalMapName = mapNameStr?.replace(/-/g, " ")
  const { error, setError, closeErrorMessage } = ErrorMessageProps()
  const [map, setMap] = useState<Map | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Set the tab title dynamically
    if (mapName && gamemode) {
      document.title = `${mapName} (${gamemode})`
    }
  }, [mapName, gamemode])

  useEffect(() => {
    const fetchStrategies = async () => {
      if (
        gamemodeStr !== "hardcore" &&
        gamemodeStr !== "special" &&
        gamemodeStr !== "normal"
      ) {
        router.replace("/404")
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
        setStrategies(data.strategies)
        setMap(data.map)
        setLoading(false)
      } catch (error) {
        setError(
          "We couldn't fetch the strategies, please try again later. If this error persists please contact the admin."
        )
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

  const goBackHandler = () => {
    router.push(`/${gamemodeStr}`)
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-3.5rem)]">
      <section>
        {loading ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)]">
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
            <div className="relative flex justify-center pt-10 pb-5">
              <ArrowBigLeft
                className="hidden sm:block fixed left-10 text-primary fill-white cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 hover:fill-primary"
                size={"2.5rem"}
                onClick={goBackHandler}
              />
              <h1 className="tracking-tight text-balance font-bold !leading-tight text-gray-900 text-xl md:text-2xl lg:text-3xl">
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
            <MaxWidthWapper>
              <div>
                {strategies.length > 0 ? (
                  <>
                    {map && map.image && (
                      <div className="relative w-full mb-5 flex flex-col items-center">
                        <Image
                          src={map.image}
                          alt={map.name || "Map Image"}
                          width={200}
                          height={200}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    {strategies.map((strategy) => (
                      <div className="pb-6" key={strategy.id}>
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
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col justify-center items-center min-h-screen -mt-40">
                    {map && map.image && (
                      <div className="relative w-full h-64 flex flex-col items-center -mt-60">
                        <Image
                          src={map.image}
                          alt={map.name || "Map Image"}
                          width={200}
                          height={200}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}

                    <p className="flex justify-center items-center gap-1">
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
                    <p className="flex justify-center items-center">
                      Have one in mind?
                    </p>
                    <Link href="/createstrategy" className="text-primary">
                      Share it now!
                    </Link>
                  </div>
                )}
              </div>
            </MaxWidthWapper>
          </div>
        )}
      </section>
    </div>
  )
}

export default MapStrategiesPage
