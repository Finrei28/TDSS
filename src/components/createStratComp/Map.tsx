"use client"

import React, { useState, useEffect } from "react"
import { PlayerSteps } from "../types"

type MapType = {
  name: string
  image: string
  difficulty: string
  gamemodes: string[]
}

type setMapProps = {
  setStrat: React.Dispatch<
    React.SetStateAction<{
      name: string
      gamemode: string
      difficulty: string
      description: string
      map: string
      numOfPlayers: string
      inGameGamemode: string
      players: PlayerSteps[]
    }>
  >
  gamemode: string | null
  map: string | null
}

const Map = ({ setStrat, gamemode, map }: setMapProps) => {
  const [maps, setMaps] = useState<MapType[]>([])
  const [selectedMap, setSelectedMap] = useState("")

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        // Construct the URL with the gamemode query parameter
        const url = new URL("/api/maps", window.location.origin)
        if (gamemode) {
          url.searchParams.append("gamemode", gamemode) // Append gamemode as a query parameter
        }

        const response = await fetch(url.toString()) // Make the request
        const data = await response.json()
        setMaps(data) // Update state with fetched maps
        if (map) {
          setSelectedMap(map)
        }
      } catch (error) {
        console.error("Error fetching maps:", error)
      }
    }

    fetchMaps()
  }, [gamemode]) // Run the effect when gamemode changes

  const handleMapClick = (map: string) => {
    setSelectedMap(map)
    setStrat((prev) => ({
      ...prev,
      numOfPlayers: "",
      map: map,
    }))
  }

  return (
    <div>
      <div className="grid md:grid-cols-4 sm:grid-cols-3 gap-4 mt-5 justify-center md:justify-start">
        {maps.map((map) => (
          <button
            key={map.name}
            onClick={() => handleMapClick(map.name)}
            className={`w-full border rounded-lg p-4 ${
              selectedMap === map.name ? "border-primary ring-primary" : ""
            }`}
          >
            <img src={map.image} alt={map.name} className="w-full" />
            <h2 className="text-center">{map.name}</h2>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Map
