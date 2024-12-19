"use client"

import React, { useState } from "react"
import { useFetchData } from "@/components/UseEffect"
import { getOrdinal } from "@/components/Utils"
import { useParams } from "next/navigation"

type userStrats = {
  id: string
}

type OrdinalTitleProps = {
  userId: string
}
const OrdinalTitle = ({ userId }: OrdinalTitleProps) => {
  const { stratId } = useParams()
  const [userStratIndex, setUserStratIndex] = useState<userStrats[] | null>(
    null
  )

  useFetchData(`/api/strategy/ordinal?userId=${userId}`, setUserStratIndex)

  if (userStratIndex === null) return <div>Loading...</div>
  const stratIndex = userStratIndex.findIndex(
    (strategy) => String(strategy.id) === stratId
  )
  const ordinal = getOrdinal(stratIndex)
  return <h1>My {ordinal} strat</h1>
}

export default OrdinalTitle
