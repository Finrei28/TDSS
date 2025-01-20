// app/special/[mapName]/page.tsx

"use client"
import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Loader from "@/components/loader"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import Link from "next/link"
import { StrategyType, Map } from "@/components/types"
import { ErrorMessage } from "@/components/ui/MessageBox"
import Image from "next/image"
import { ErrorMessageProps } from "@/components/ClientUtils"
import { ArrowBigLeft } from "lucide-react"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

const MapStrategiesPage = () => {
  const { mapName, gamemode } = useParams()
  const mapNameStr = Array.isArray(mapName) ? mapName[0] : mapName
  const gamemodeStr = Array.isArray(gamemode) ? gamemode[0] : gamemode
  const originalMapName = mapNameStr?.replace(/-/g, " ")
  const {
    error: customError,
    setError,
    closeErrorMessage,
  } = ErrorMessageProps()
  const router = useRouter()

  useEffect(() => {
    // Set the tab title dynamically
    if (mapName && gamemode) {
      document.title = `${mapName} (${gamemode})`
    }
  }, [mapName, gamemode])

  const fetchStrategies = async (
    mapNameStr: string
  ): Promise<{ strategies: StrategyType[]; map: Map }> => {
    if (
      gamemodeStr !== "hardcore" &&
      gamemodeStr !== "special" &&
      gamemodeStr !== "normal"
    ) {
      router.replace("/404")
    }

    const mapResponse = await fetch(`/api/maps?name=${originalMapName}`)
    if (mapResponse.status === 404) {
      router.replace("/404")
      throw new Error("Page not found")
    }

    const url = new URL("/api/strategies", window.location.origin)
    url.searchParams.append("mapName", mapNameStr) // Append gamemode as a query parameter
    url.searchParams.append("gamemode", gamemodeStr)
    const response = await fetch(url.toString()) // Make the request
    if (!response.ok) {
      throw new Error(
        "We couldn't fetch the strategies, please try again later. If this error persists please contact the admin."
      )
    }
    const data = await response.json()
    return { strategies: data.strategies, map: data.map }
  }

  const { data, isLoading, isError, error } = useQuery<
    { strategies: StrategyType[]; map: Map },
    Error
  >({
    queryKey: ["strategies", gamemodeStr, mapNameStr], // Pass the query key
    queryFn: () => fetchStrategies(mapNameStr), // Pass the fetch function
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    cacheTime: 60 * 60 * 1000, // Retain cache for 60 minutes
  } as UseQueryOptions<{ strategies: StrategyType[]; map: Map }, Error>)

  useEffect(() => {
    // If there's an error from the query, pass it to the custom error handler
    if (isError && error) {
      setError(error.message || "An error occurred while fetching strategies")
    }
  }, [isError, error, setError])

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
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)]">
            <Loader />
          </div>
        ) : (
          <div>
            <div className="fixed bottom-4 ml-4 p-4 z-110">
              {customError && (
                <ErrorMessage
                  message={customError}
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
                {data?.strategies && data.strategies.length > 0 ? (
                  <>
                    {data.map && data.map.image && (
                      <div className="relative w-full mb-5 flex flex-col items-center">
                        <Image
                          src={data.map.image}
                          alt={data.map.name || "Map Image"}
                          width={200}
                          height={200}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    {data.strategies.map((strategy) => (
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
                  <div className="flex flex-col justify-center items-center min-h-screen -mt-40 px-4">
                    {data?.map && data.map.image && (
                      <div className="relative w-full max-w-xs h-64 flex flex-col items-center sm:max-w-md md:max-w-lg">
                        <Image
                          src={data.map.image}
                          alt={data.map.name || "Map Image"}
                          width={200}
                          height={200}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}

                    <p className="text-center text-sm sm:text-base md:text-lg mt-4">
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
                    <p className="text-center text-sm sm:text-base md:text-lg mt-2">
                      Have one in mind?
                    </p>
                    <Link
                      href="/createstrategy"
                      className="text-primary text-sm sm:text-base md:text-lg mt-2"
                    >
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
