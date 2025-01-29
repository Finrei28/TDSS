"use client"
import React, { useEffect, useState } from "react"
import { User, Map } from "../types"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { generateSlug } from "../utils"

type HomeStrategyType = {
  id: string
  name: string
  _count: { strategyLikes: number }
  map: Map
  numOfPlayer: string
  difficulty: string
  gamemode: string
  createdAt: Date
  createdBy: User
  inGameGamemode?: string
}

const TopStrategies = () => {
  const [strategies, setStrategies] = useState<HomeStrategyType[] | null>(null)

  useEffect(() => {
    const topStrats = async () => {
      const response = await fetch("/api/strategy/getTopStrategies")
      const data = await response.json()
      console.log(data)
      setStrategies(data)
    }
    topStrats()
  }, [])

  return (
    <div className="flex flex-col justify-center items-center p-10">
      <h2 className="text-2xl font-bold mb-4">Top 5 Most Liked Strategies</h2>
      <div className="flex grid-cols-5 justify-center items-center space-x-5">
        {strategies?.map((strategy) => (
          <Link
            href={`/${strategy.gamemode.toLowerCase()}/${generateSlug(
              strategy.map?.name
            )}/Strat/${strategy.id}`}
            key={strategy.id}
            className="relative rounded-lg shadow-lg overflow-hidden bg-slate-50 flex flex-col duration-300 md:hover:scale-105"
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
                {strategy.createdAt && (
                  <p>
                    Created:{" "}
                    {formatDistanceToNow(new Date(strategy.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                )}
                <p>Liked: {strategy._count.strategyLikes}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TopStrategies
