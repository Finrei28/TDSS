"use client"
import AboutContent from "@/components/aboutPage/mainContent"
import Loader from "@/components/loader"
import MaxWidthWapper from "@/components/MaxWidthWapper"
import { Map } from "@/components/types"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import React from "react"

type Image = {
  id: string
  url: string
  side: "left" | "right"
}

const About = () => {
  const fetchMaps = async () => {
    const response = await fetch("api/maps")
    if (!response.ok) {
      throw new Error("Failed to fetch maps")
    }
    const data = await response.json()

    // Extract images from each map
    const mapImages = data.map((map: Map, index: number) => ({
      id: map.id,
      url: map.image,
      side: index % 2 === 0 ? "left" : "right",
    }))
    //get images from a collection of maps
    return mapImages
  }

  const { data: Images, isLoading } = useQuery<Image[]>({
    queryKey: ["about"], // Pass the query key
    queryFn: () => fetchMaps(), // Pass the fetch function
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    cacheTime: 60 * 60 * 1000, // Retain cache for 60 minutes
  } as UseQueryOptions<Image[]>)

  return (
    <div className="bg-slate-50">
      {isLoading ? (
        <div className="min-h-[calc(100vh-3.5rem)] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <MaxWidthWapper>
          <AboutContent images={Images} />
        </MaxWidthWapper>
      )}
    </div>
  )
}

export default About
