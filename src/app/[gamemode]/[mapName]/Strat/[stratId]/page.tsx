"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation" // Get the dynamic route parameter
import { PlayerSteps, strategyLikes, StrategyType } from "@/components/types"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import { ArrowBigLeft, Heart } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image"
import React from "react"
const PlayerStepData = dynamic(
  () => import("@/components/strategyData/PlayerStepData"),
  {
    loading: () => <p className="flex justify-center">Loading...</p>, // Optional: a loading component while the dynamic import is being loaded
    ssr: false, // Disables server-side rendering for this component
  }
)
import { formatDistanceToNow } from "date-fns"
import { useSession } from "next-auth/react"
import debounce from "@/components/debounce"
import dynamic from "next/dynamic"
import Comments from "@/components/strategyData/Comments"
import { ErrorMessage } from "@/components/ui/MessageBox"
import { ErrorMessageProps } from "@/components/ClientUtils"
import Loader from "@/components/loader"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

const page = () => {
  const { mapName, gamemode, stratId } = useParams() // Fetch mapName from the dynamic route
  const stratIdStr = Array.isArray(stratId) ? stratId[0] : stratId
  const mapNameStr = Array.isArray(mapName) ? mapName[0] : mapName
  const gamemodeStr = Array.isArray(gamemode) ? gamemode[0] : gamemode
  const [strategy, setStrategy] = useState<StrategyType | null>(null)
  const { data: session, status } = useSession()
  const [liked, setLiked] = useState(false)
  const router = useRouter()
  const {
    error: customError,
    setError,
    closeErrorMessage,
  } = ErrorMessageProps()
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    // Set the tab title dynamically
    if (mapName && gamemode && stratId) {
      document.title = `Strategy ${stratId} - ${mapName} (${gamemode})`
    }
  }, [mapName, gamemode, stratId])

  const handleLike = debounce(async () => {
    if (!session?.user.id) {
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 2000) // Hide message after 2 seconds
      return
    }
    // Toggle the liked state
    const newLiked = !liked
    setLiked(newLiked)

    const url = new URL("/api/strategy/strategyLikes", window.location.origin)
    url.searchParams.append("stratId", stratIdStr)
    url.searchParams.append("userId", session.user.id)
    url.searchParams.append("liked", liked.toString())
    try {
      const response = await fetch(url.toString())
      if (!response.ok) {
        setError(
          "We couldn't save your changes, please try again later. If this error persists please contact the admin."
        )
      }
      const data = await response.json()
      setStrategy(data)
    } catch (error) {
      setError(
        "We couldn't save your changes, please try again later. If this error persists please contact the admin."
      )
    }
  }, 500)

  useEffect(() => {
    if (status === "loading") return // Wait until loading is complete

    if (strategy && strategy.strategyLikes) {
      const hasLiked = strategy.strategyLikes.some(
        (like: strategyLikes) => like.userId === session?.user.id
      )
      setLiked(hasLiked)
    }
  }, [strategy, session, status])

  useEffect(() => {
    if (
      gamemodeStr !== "hardcore" &&
      gamemodeStr !== "special" &&
      gamemodeStr !== "normal"
    ) {
      router.replace("/404")
      return
    }
  }, [stratId])

  const fetchStrategy = async (
    mapNameStr: string,
    gamemodeStr: string,
    stratIdStr: string
  ): Promise<StrategyType> => {
    const url = new URL("/api/strategy", window.location.origin)
    url.searchParams.append("mapName", mapNameStr) // Append gamemode as a query parameter
    url.searchParams.append("gamemode", gamemodeStr)
    url.searchParams.append("stratId", stratIdStr)
    const response = await fetch(url.toString()) // Make the request
    if (response.status === 404) {
      router.replace("/404")
      throw new Error("Page not found")
    }
    if (!response.ok) {
      throw new Error(
        "Failed to fetch this strategy, please try again later. If this error persists please contact the admin."
      )
    }
    const data = await response.json()
    return data
  }

  const {
    data: strategyData,
    isLoading,
    isError,
    error,
  } = useQuery<StrategyType, Error>({
    queryKey: ["strategyData", mapNameStr, gamemodeStr, stratIdStr], // Pass the query key
    queryFn: () => fetchStrategy(mapNameStr, gamemodeStr, stratIdStr), // Pass the fetch function
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    cacheTime: 60 * 60 * 1000, // Retain cache for 60 minutes
  } as UseQueryOptions<StrategyType, Error>)

  useEffect(() => {
    if (strategyData) {
      setStrategy(strategyData)
    }
  }, [strategyData])

  useEffect(() => {
    // If there's an error from the query, pass it to the custom error handler
    if (isError && error) {
      setError(error.message || "An error occurred while fetching the strategy")
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
    router.push(`/${gamemodeStr}/${mapNameStr}`)
  }

  const numberOfPlayers = strategy ? getNumberOfPlayers(strategy) : undefined
  return (
    <div className="bg-primary">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)]">
          <Loader />
        </div>
      ) : (
        <>
          <div className="fixed bottom-4 ml-4 p-4 z-110">
            {customError && (
              <ErrorMessage
                message={customError}
                closeErrorMessage={closeErrorMessage}
              />
            )}
          </div>
          <MaxWidthWapper className="lg:max-w-screen-lg md:max-w-screen-md pt-10">
            <section className="bg-slate-50 rounded-lg shadow-md p-8 min-h-[calc(100vh-3.5rem)] lg:pr-20 lg:pl-20 mb-5">
              <div className="mb-10">
                <div className="relative flex justify-center pt-10 pb-10">
                  <ArrowBigLeft
                    className="hidden sm:block absolute left-0 text-primary fill-white cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 hover:fill-primary"
                    size={"2.5rem"}
                    onClick={goBackHandler}
                  />
                  <h1 className="tracking-tight text-balance font-bold !leading-tight text-gray-900 text-xl md:text-2xl lg:text-3xl">
                    {strategy && strategy.name
                      ? `Strategy ${strategy.name}`
                      : `Strategy ${
                          strategy?.id
                        } for ${strategy?.gamemode?.toUpperCase()} ${mapNameStr}`}
                  </h1>
                </div>

                {strategy && strategy.map.image && (
                  <div className="relative w-full h-64 flex flex-col items-center">
                    <Image
                      src={strategy.map.image}
                      alt={strategy.map.name || "Map Image"}
                      width={200}
                      height={200}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                      className="object-cover rounded-md"
                    />
                  </div>
                )}

                <div>
                  {strategy ? (
                    <div>
                      <div
                        key={strategy.id}
                        className="flex flex-col border rounded-lg p-4 bg-white border-gray-500 text-gray-500"
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
                        {strategy.createdAt && (
                          <p>
                            Created:{" "}
                            {formatDistanceToNow(new Date(strategy.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        )}

                        {strategy.description && (
                          <p>Description/Notes: {strategy.description}</p>
                        )}
                        {strategy.strategyLikes &&
                          strategy.strategyLikes.length > 0 && (
                            <p>Likes: {strategy.strategyLikes?.length}</p>
                          )}
                        <div className="flex flex-row justify-end gap-2">
                          <div className="cursor-pointer flex justify-center items-center">
                            {session?.user.id ? (
                              <span
                                className={`hover:text-red-300 ${
                                  liked ? "text-red-500" : "text-gray-500"
                                }`}
                                onClick={handleLike}
                              >
                                <Heart
                                  fill={`${liked ? "red" : "transparent"}`}
                                  size="20px"
                                />
                              </span>
                            ) : (
                              <div>
                                <Heart size="20px" onClick={handleLike} />
                                {showMessage && (
                                  <div className="absolute mt-1 p-2 bg-primary text-white text-xs rounded-lg shadow-md">
                                    Please sign in to like this strategy!
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <p>Created By: {strategy.createdBy?.username}</p>
                        </div>
                      </div>
                      <div className="pt-8">
                        <Accordion type="multiple" className="w-full">
                          {numberOfPlayers &&
                            Array.from(
                              { length: Number(numberOfPlayers) },
                              (_, i) => {
                                return (
                                  <AccordionItem
                                    key={`player-${i + 1}`}
                                    value={`player-${i + 1}`}
                                  >
                                    <AccordionTrigger>
                                      Player{" "}
                                      {i === 0
                                        ? "One"
                                        : i === 1
                                        ? "Two"
                                        : i === 2
                                        ? "Three"
                                        : "Four"}
                                      :
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-5">
                                      <PlayerStepData
                                        playerData={
                                          strategy.players
                                            ? strategy.players[i]
                                            : ({} as PlayerSteps)
                                        }
                                        player={i}
                                        gamemode={strategy.gamemode}
                                      />
                                    </AccordionContent>
                                  </AccordionItem>
                                )
                              }
                            )}
                        </Accordion>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center min-h-screen -mt-40">
                      <p>Something went wrong. Please try again</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
            <section className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex flex-col justify-center items-center">
                <div className="w-full lg:pl-20 lg:pr-20">
                  <Comments stratId={stratIdStr} />
                </div>
              </div>
            </section>
          </MaxWidthWapper>
        </>
      )}
    </div>
  )
}

export default page
