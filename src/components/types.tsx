export type PlayerData = {
  id?: number
  waveStart: string
  waveEnd: string
  description: string
}

export type PlayerSteps = {
  id?: number
  playerNo: number
  consumables: string[]
  towers: string[]
  steps: PlayerData[]
}

export type Map = {
  id?: number
  name: string
  image?: string
  difficulty?: string
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
  id?: number
  name: string
  map: Map // Allow `map` to be a string or Map type
  mapId?: number
  description: string
  numOfPlayer: string
  difficulty: string
  gamemode: string
  inGameGamemode?: string | null
  players?: PlayerSteps[]
  createdAt?: Date
  createdBy?: User
  userId?: string
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

export type CommentType = {
  id: number
  content: string
  createdAt: string
  author: {
    id: string
    username: string
  }
  replies: CommentType[] // Recursive type for nested replies
  parentCommentId: number
  stratId: string
}

export type initialStrategyType = {
  id?: number
  name: string
  gamemode: string
  difficulty: string
  description: string
  map: string
  numOfPlayer: string
  inGameGamemode: string
  players: PlayerSteps[]
}
