"use client"
import { useEffect, useState } from "react"
import { notFound, useParams, useRouter } from "next/navigation" // Get the dynamic route parameter
import {
  PlayerSteps,
  strategyLikes,
  StrategyType,
  User,
} from "@/components/types"
import Loader from "@/components/loader"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import { Heart, HeartOff } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

const page = () => {
  const { mapName, gamemode, stratId } = useParams() // Fetch mapName from the dynamic route
  const stratIdStr = Array.isArray(stratId) ? stratId[0] : stratId
  const mapNameStr = Array.isArray(mapName) ? mapName[0] : mapName
  const gamemodeStr = Array.isArray(gamemode) ? gamemode[0] : gamemode
  const [strategy, setStrategy] = useState<StrategyType | null>(null)
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()
  const [liked, setLiked] = useState(false)
  const router = useRouter()

  const [showMessage, setShowMessage] = useState(false)

  const handleLike = debounce(async () => {
    if (!session) {
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 2000) // Hide message after 2 seconds
      return
    }
    const newLiked = !liked
    console.log(liked)
    setLiked(newLiked)
    console.log(liked)
    // Toggle the liked state
    const url = new URL("/api/strategy/strategyLikes", window.location.origin)
    url.searchParams.append("stratId", stratIdStr)
    url.searchParams.append("userId", session.user.id)
    url.searchParams.append("liked", liked.toString())
    try {
      const response = await fetch(url.toString()) // Consider using POST for likes
      if (!response.ok) {
        throw new Error("Network response was not ok") // Handle errors
      }
      const data = await response.json()
      setStrategy(data)
    } catch (error) {
      console.error("Error liking strategy:", error)
      // Optionally, show an error message to the user
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
    const fetchStrategies = async () => {
      try {
        const url = new URL("/api/strategy", window.location.origin)
        url.searchParams.append("mapName", mapNameStr) // Append gamemode as a query parameter
        url.searchParams.append("gamemode", gamemodeStr)
        url.searchParams.append("stratId", stratIdStr)
        const response = await fetch(url.toString()) // Make the request
        if (response.status === 404) {
          console.log(404)
          router.replace("/404")
          return
        }
        const data = await response.json()
        console.log(data)
        setStrategy(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching strategies:", error)
      }
    }

    fetchStrategies()
  }, [stratId])
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

  const numberOfPlayers = strategy ? getNumberOfPlayers(strategy) : undefined

  return (
    <div className="bg-slate-50 min-h-screen -mt-14">
      <MaxWidthWapper className="lg:max-w-screen-lg md:max-w-screen-md pt-10 ">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen -mt-10">
            <Loader />
          </div>
        ) : (
          <>
            <section>
              <div className="pb-52">
                <div className="flex justify-center pt-20 pb-10">
                  <h1 className="relative w-fit tracking-tight text-balance font-bold !leading-tight text-gray-900 text-xl md:text-2xl lg:text-3xl">
                    {strategy && strategy.name
                      ? `Strategy ${strategy.name}`
                      : `Strategy ${
                          strategy?.id
                        } for ${strategy?.gamemode?.toUpperCase()} ${mapNameStr}`}
                  </h1>
                </div>

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
                        <p>
                          Created{" "}
                          {formatDistanceToNow(new Date(strategy.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                        {strategy.description && (
                          <p>Description/Notes: {strategy.description}</p>
                        )}
                        {strategy.strategyLikes &&
                          strategy.strategyLikes.length > 0 && (
                            <p>Likes: {strategy.strategyLikes?.length}</p>
                          )}
                        <div className="flex flex-row justify-end gap-2">
                          <div className="cursor-pointer flex justify-center items-center">
                            {session ? (
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
                                    <AccordionContent>
                                      <PlayerStepData
                                        strat={strategy}
                                        player={i}
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
            <section>
              <div className="flex flex-col justify-center items-center pt-10 pb-10">
                <h1 className="text-gray-900 text-xl md:text-2xl lg:text-3xl font-bold">
                  Comments
                </h1>
                <div>
                  <Comments />
                </div>
              </div>
            </section>
          </>
        )}
      </MaxWidthWapper>
    </div>
  )
}

export default page
