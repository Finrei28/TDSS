import React from "react"

export type PlayerData = {
  waveStart: string
  waveEnd: string
  description: string
}

export type PlayerSteps = {
  playerNo: number
  consumables: string[]
  towers: string[]
  steps: PlayerData[]
}

export type Map = {
  id: number
  name: string
  image: string
  difficulty: string
}

export type User = {
  id: string
  username: string
  email: string
  strategies: StrategyType[]
  strategyLikes: strategyLikes[]
  comments?: []
}

export type StrategyType = {
  id: number
  name: string
  map: Map
  mapId: number
  description: string
  numOfPlayer: string
  difficulty: string
  gamemode: string
  inGameGamemode: string | null
  players?: PlayerSteps[]
  createdAt: Date
  createdBy?: User
  userId: string
  strategyLikes?: []
  comments?: []
}

export type strategyLikes = {
  id: number
  userId: string
  strategyId: number
  strategy: StrategyType
  likedAt: Date
}

export type Comment = {
  id: number
  content: string
  createdAt: string
  author: {
    id: string
    name: string
  }
  replies: Comment[] // Recursive type for nested replies
}
