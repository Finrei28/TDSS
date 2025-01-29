import { PlayerData, PlayerSteps, StrategyType, Map } from "../types"

export interface StratRef {
  submit: () => void
}

export type GamemodeProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  gamemode: string
  mode?: string
}

export type StratNameProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  stratName: string
  setNameCheck?: React.Dispatch<React.SetStateAction<boolean>>
  mode?: string
}

export type numOfPlayerProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  gamemode: string
  numOfPlayer: string
  mode?: string
}

export type DescriptionProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  stratDescription: string
  setDescriptionCheck?: React.Dispatch<React.SetStateAction<boolean>>
  mode?: string
}

export type DifficultyProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  difficulty: string | null
  mode?: string
}

export type InGameGamemodeProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  inGameGamemode: string | undefined
  mode?: string
}

export type PlayerStepProps = {
  player: number
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  playerData: PlayerSteps
  initialPlayerSteps: PlayerData
  maxWaves: number
  setNextCheck?: React.Dispatch<
    React.SetStateAction<{
      playerOne: boolean
      playerTwo: boolean
      playerThree: boolean
      playerFour: boolean
    }>
  >
  nextCheck?: {
    playerOne: boolean
    playerTwo: boolean
    playerThree: boolean
    playerFour: boolean
  }
  mode?: string
  gamemode: string
}

// Union type for all possible props
export type ComponentProps =
  | GamemodeProps
  | StratNameProps
  | numOfPlayerProps
  | DescriptionProps
  | DifficultyProps
  | InGameGamemodeProps
  | PlayerStepProps
