"use client"

import React, { useState, useEffect } from "react"
import { Map, PlayerSteps, StrategyType } from "../types"
import { ErrorMessage } from "../ui/MessageBox"
import { ErrorMessageProps } from "../ClientUtils"
import Loader from "../loader"

type setMapProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  gamemode: string | null
  map: Map
}

const StratMap = ({ setStrat, gamemode, map }: setMapProps) => {
  const [maps, setMaps] = useState<Map[]>([])
  const [selectedMap, setSelectedMap] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMaps, setFilteredMaps] = useState<Map[]>([])
  const { error, setError, closeErrorMessage } = ErrorMessageProps()
  const [loading, setLoading] = useState(true)

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
        setMaps(data)
        setFilteredMaps(data)
        if (map) {
          setSelectedMap(map.name)
        }
        setLoading(false)
      } catch (error) {
        setError(
          "Could not load the maps, please try reloading the page. If the error persists, please contact the admin."
        )
      }
    }

    fetchMaps()
  }, [gamemode]) // Run the effect when gamemode changes

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    setFilteredMaps(
      maps.filter((map) => map.name.toLowerCase().includes(query)) // Filter maps by name
    )
  }, [searchQuery, maps])

  const handleMapClick = (mapName: string) => {
    setSelectedMap(mapName)
    setStrat((prev) => ({
      ...prev,
      numOfPlayer: "",
      map: { name: mapName },
    }))
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="fixed bottom-4 ml-4 p-4 z-110">
            {error && (
              <ErrorMessage
                message={error}
                closeErrorMessage={closeErrorMessage}
              />
            )}
          </div>
          <div className="mb-4 flex justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search maps..."
              className="w-1/3 px-4 py-3 border rounded-xl "
            />
          </div>
          <div className="grid md:grid-cols-4 sm:grid-cols-3 gap-4 mt-5 justify-center md:justify-start">
            {filteredMaps.map((map) => (
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
        </>
      )}
    </div>
  )
}

export default StratMap
