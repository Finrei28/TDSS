"use client"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect } from "react"
import Loader from "@/components/loader"
import Image from "next/image"
import { ErrorMessage } from "@/components/ui/MessageBox"
import { ErrorMessageProps } from "@/components/ClientUtils"
import { ArrowBigLeft } from "lucide-react"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { Map } from "@/components/types"

const page = () => {
  const { gamemode } = useParams()
  const gamemodeStr = Array.isArray(gamemode) ? gamemode[0] : gamemode
  const {
    error: customError,
    setError,
    closeErrorMessage,
  } = ErrorMessageProps()
  const router = useRouter()

  useEffect(() => {
    // Set the tab title dynamically
    if (gamemode) {
      document.title = `${gamemodeStr.toUpperCase()} (Gamemode)`
    }
  }, [gamemode])

  useEffect(() => {
    if (
      gamemodeStr !== "hardcore" &&
      gamemodeStr !== "special" &&
      gamemodeStr !== "normal"
    ) {
      router.replace("/404")
      return
    }
  }, [])

  const fetchMaps = async (gamemodeStr: string): Promise<Map[]> => {
    const url = new URL("/api/maps", window.location.origin)
    url.searchParams.append("gamemode", gamemodeStr)

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(
        "Failed to fetch maps, please try again later. If this error persists please contact the admin."
      )
    }
    return await response.json()
  }

  const {
    data: maps,
    isLoading,
    isError,
    error,
  } = useQuery<Map[], Error>({
    queryKey: ["maps", gamemodeStr], // Pass the query key
    queryFn: () => fetchMaps(gamemodeStr), // Pass the fetch function
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    cacheTime: 60 * 60 * 1000, // Retain cache for 60 minutes
  } as UseQueryOptions<Map[], Error>)

  useEffect(() => {
    // If there's an error from the query, pass it to the custom error handler
    if (isError && error) {
      setError(error.message || "An error occurred while fetching maps")
    }
  }, [isError, error, setError])

  const generateSlug = (name: string) => {
    return name
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, "") // Remove all non-word characters
  }

  const goBackHandler = () => {
    router.push(`/`)
  }

  return (
    <section className="bg-slate-50">
      {isLoading ? (
        <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center">
          <Loader />
        </div>
      ) : maps && maps.length > 0 ? (
        <div>
          <div className="fixed bottom-4 ml-4 p-4 z-110">
            {customError && (
              <ErrorMessage
                message={customError}
                closeErrorMessage={closeErrorMessage}
              />
            )}
          </div>
          <ArrowBigLeft
            className="hidden sm:block fixed left-10 text-primary fill-white cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 hover:fill-primary mt-10"
            size={"2.5rem"}
            onClick={goBackHandler}
          />
          <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center justify-center pt-10 pb-10">
              <h1 className="relative w-fit tracking-tight text-balance font-bold !leading-tight text-gray-900 text-xl md:text-2xl lg:text-3xl">
                Pick a map!
              </h1>
            </div>
            <MaxWidthWapper className=" lg:max-w-2xl md:max-w-xl sm:max-w-md max-w-xs">
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-20">
                  {maps.map((map) => (
                    <Link
                      key={map.name}
                      href={`/${gamemodeStr}/${generateSlug(map.name)}`}
                      className={`flex flex-col justify-center items-center border rounded-lg p-4 ${
                        gamemodeStr === "normal"
                          ? "bg-green-500"
                          : gamemodeStr === "special"
                          ? "bg-orange-400"
                          : "bg-purple-600"
                      } transition-transform duration-300 md:hover:scale-105`}
                    >
                      {map && map.image && (
                        <Image
                          src={map.image}
                          alt={map.name}
                          width={184}
                          height={184}
                          className="w-full object-contain"
                        />
                      )}

                      <h2 className="text-center mt-2">{map.name}</h2>
                    </Link>
                  ))}
                </div>
              </div>
            </MaxWidthWapper>
          </div>
        </div>
      ) : (
        <MaxWidthWapper>
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)]">
            <div className="fixed bottom-4 ml-14 p-4 z-110">
              {customError && (
                <ErrorMessage
                  message={customError}
                  closeErrorMessage={closeErrorMessage}
                />
              )}
            </div>
            <div>
              <h1 className="relative w-fit tracking-tight text-balance font-bold !leading-tight text-gray-900 text-xl md:text-2xl lg:text-3xl">
                No maps found
              </h1>
            </div>
          </div>
        </MaxWidthWapper>
      )}
    </section>
  )
}

export default page
