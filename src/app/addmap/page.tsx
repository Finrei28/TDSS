"use client"

import FormField from "@/components/FormField"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import React, { ChangeEvent, Suspense, useEffect, useState } from "react"
import { X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { redirect, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Loader from "@/components/loader"

const fileToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const AddMapForm = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/addmap")
    },
  })

  const [error, setError] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [map, setMap] = useState({
    mapName: "",
    image: "",
    difficulty: "",
    gamemode: "",
    gamemodes: [] as string[],
  })
  const searchParams = useSearchParams()
  useEffect(() => {
    const mapName = searchParams.get("mapName") || ""
    const difficulty = searchParams.get("difficulty") || ""
    const gamemode = searchParams.get("gamemode") || ""

    const gamemodesFromQuery =
      searchParams.getAll("gamemodes") || ([] as string[])

    // Autofill the map state with the query params
    setMap((prev) => ({
      ...prev,
      mapName: mapName,
      difficulty: difficulty,
      gamemode: gamemode,
      gamemodes: gamemodesFromQuery,
    }))
  }, [searchParams])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "gamemode") {
      setMap((prev) => ({
        ...prev,
        gamemode: value, // Store the selected gamemode
        gamemodes: prev.gamemodes.includes(value)
          ? prev.gamemodes
          : [...prev.gamemodes, value], // Avoid duplicates
      }))
    } else if (
      name === "image" &&
      e.target instanceof HTMLInputElement &&
      e.target.files &&
      e.target.files[0]
    ) {
      const file = e.target.files[0]

      setFile(file)
      setPreviewSrc(URL.createObjectURL(file))
    }
    setMap((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle deleting a gamemode
  const handleDeleteGamemode = (gamemodeToDelete: string) => {
    setMap((prev) => ({
      ...prev,
      gamemodes: prev.gamemodes.filter((gm) => gm !== gamemodeToDelete),
      gamemode: "", // Remove gamemode
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(false)
    if (
      map.difficulty === "" ||
      map.gamemodes.length === 0 ||
      map.image === "" ||
      map.mapName === ""
    ) {
      setError(true)
      return
    }
    setLoading(true)
    if (!file) {
      return
    }
    const formData = new FormData()
    formData.append("name", map.mapName)
    formData.append("image", file)
    const base64Image = await fileToBase64(file)
    const { mapName, difficulty, gamemodes } = map
    const mapValues = {
      name: mapName,
      gamemodes,
      difficulty,
      base64Image,
    }
    const res = await fetch("/api/addMap", {
      method: "POST",
      body: JSON.stringify({ data: { mapValues } }), // Convert file to base64 string
      headers: {
        "Content-Type": "application/json", // Make sure to set this header
      },
    })

    if (res.ok) {
      const newMap = await res.json()
      setMap({
        mapName: "",
        image: "",
        difficulty: "",
        gamemode: "",
        gamemodes: [] as string[],
      })
      setPreviewSrc(null)
      setSuccess(true)

      console.log("Map created:", newMap)
      // Optionally update state or do something else
    } else {
      console.error("Failed to create map:", res.statusText)
    }

    setLoading(false)
    const timeoutId = setTimeout(() => {
      setSuccess(false)
    }, 3000)
    return () => clearTimeout(timeoutId)
  }

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (session.user.role !== "ADMIN") {
    return <p>You're not an admin</p>
  }

  return (
    <section className="bg-slate-50 min-h-screen -mt-14">
      <MaxWidthWapper className="lg:max-w-screen-lg md:max-w-screen-md pb-24 pt-10 lg:grid sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-15 xl:pt-20 lg:pb-40">
        <div className="relative mx-auto text-center flex flex-col justify-center items-center">
          <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-1xl md:text-2xl lg:text-3xl">
            Add a map
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Name of map:"
            type="text"
            placeholder="Enter the name of the map"
            name="mapName"
            value={map.mapName}
            handlechange={handleChange}
            error={error && map.mapName === ""}
          />
          <div className="text-sm text-red-500 mt-1 ml-1">
            {error && map.mapName === "" && "Please enter the name of the map"}
          </div>
          <FormField
            label="Difficulty:"
            type="text"
            placeholder="Enter the difficulty of the map"
            name="difficulty"
            value={map.difficulty}
            handlechange={handleChange}
            options={["VERY EASY", "EASY", "NORMAL", "HARD", "INSANE"]}
            error={error && map.difficulty === ""}
          />
          <div className="text-sm text-red-500 mt-1 ml-1">
            {error &&
              map.difficulty === "" &&
              "Please select a difficulty for the map"}
          </div>
          <FormField
            label="Gamemode(s):"
            type="text"
            placeholder="Enter the gamemode(s) of the map"
            name="gamemode"
            value={map.gamemode}
            handlechange={handleChange}
            options={["NORMAL", "SPECIAL", "HARDCORE"]}
            selectedgamemodes={map.gamemodes}
            error={error && map.gamemodes.length === 0}
          />
          <div className="text-sm text-red-500 mt-1 ml-1">
            {error &&
              map.gamemodes.length === 0 &&
              "Please select the gamemode(s) of the map"}
          </div>
          <div>
            {map.gamemodes.length > 0 && (
              <ul>
                {map.gamemodes.map((gm) => (
                  <li
                    key={gm}
                    className="bg-gray-50 border rounded-sm m-2 relative inline-flex items-center p-2"
                  >
                    {gm}
                    <X
                      onClick={() => handleDeleteGamemode(gm)}
                      className="text-red-500 cursor-pointer bg-none border-none ml-1 w-5 h-5"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <FormField
            label="Image:"
            type="file"
            placeholder="choose an image for the map"
            name="image"
            value={map.image}
            handlechange={handleChange}
            error={error && map.image === ""}
          />
          <div className="text-sm text-red-500 mt-1 ml-1">
            {error && map.image === "" && "Please choose an image for the map"}
          </div>
          {previewSrc && <img src={previewSrc} alt="Image Preview" />}
          <div className="flex items-center justify-center mt-10">
            <button
              type="submit"
              className={buttonVariants({
                size: "lg",
                className: "w-full sm:w-auto sm:flex items-center px-5 py-5",
              })}
              disabled={loading}
            >
              {loading ? <ReloadIcon className="animate-spin mr-3" /> : null}
              Add map
            </button>
          </div>
          {success && (
            <span className="flex items-center justify-center mt-10 text-base text-green-400">
              Successfully added a map
            </span>
          )}
        </form>
      </MaxWidthWapper>
    </section>
  )
}

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-3.5rem)] flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <AddMapForm />
    </Suspense>
  )
}

export default page
