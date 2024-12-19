"use client"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import Loader from "@/components/Loader"
import Image from "next/image"
import { ErrorMessage } from "@/components/ui/MessageBox"
import { ErrorMessageProps } from "@/components/ClientUtils"
import { ArrowBigLeft } from "lucide-react"

type MapType = {
  name: string
  image: string
  difficulty: string
  gamemodes: string[]
}

const page = () => {
  const [maps, setMaps] = useState<MapType[]>([])
  const { gamemode } = useParams()
  const [loading, setLoading] = useState(true)
  const gamemodeStr = Array.isArray(gamemode) ? gamemode[0] : gamemode
  const { error, setError, closeErrorMessage } = ErrorMessageProps()
  const router = useRouter()
  useEffect(() => {
    if (
      gamemodeStr !== "hardcore" &&
      gamemodeStr !== "special" &&
      gamemodeStr !== "normal"
    ) {
      router.replace("/404")
      return
    }
    const fetchMaps = async () => {
      try {
        const url = new URL("/api/maps", window.location.origin)
        url.searchParams.append("gamemode", gamemodeStr)

        const response = await fetch(url.toString())
        const data = await response.json()
        setMaps(data)
        setLoading(false)
      } catch (error) {
        setError(
          "Could not fetch maps, please try again later. If this error persists please contact the admin."
        )
      }
    }

    fetchMaps()
  }, [])

  const generateSlug = (name: string) => {
    return name
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, "") // Remove all non-word characters
  }

  const goBackHandler = () => {
    router.push(`/`)
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-3.5rem)]">
      <section>
        {loading ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)]">
            <Loader />
          </div>
        ) : maps.length > 0 ? (
          <div>
            <div className="fixed bottom-4 ml-4 p-4 z-110">
              {error && (
                <ErrorMessage
                  message={error}
                  closeErrorMessage={closeErrorMessage}
                />
              )}
            </div>
            <div className="relative flex justify-center pt-10 pb-10">
              <ArrowBigLeft
                className="hidden sm:block fixed left-10 text-primary fill-white cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 hover:fill-primary"
                size={"2.5rem"}
                onClick={goBackHandler}
              />
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
                      } transition-transform duration-300 hover:scale-105`}
                    >
                      <Image
                        src={map.image}
                        alt={map.name}
                        width={184}
                        height={184}
                        className="w-full object-contain"
                      />
                      <h2 className="text-center mt-2">{map.name}</h2>
                    </Link>
                  ))}
                </div>
              </div>
            </MaxWidthWapper>
          </div>
        ) : (
          <MaxWidthWapper>
            <div className="flex flex-col items-center justify-center mb-10">
              <h1 className="relative w-fit tracking-tight text-balance font-bold !leading-tight text-gray-900 text-xl md:text-2xl lg:text-3xl">
                No maps found
              </h1>
            </div>
          </MaxWidthWapper>
        )}
      </section>
    </div>
  )
}

export default page
