import { PlayerData } from "./types"

export const generateSlug = (name: string) => {
  return name
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove all non-word characters
}

export const getOrdinal = (index: number): string => {
  const ordinals = ["first", "second", "third"]
  if (index < ordinals.length) {
    return ordinals[index]
  }
  // For numbers beyond the predefined array, use suffixes (e.g., "11th", "12th")
  const suffix = (index + 1) % 10
  if (suffix === 1 && (index + 1) % 100 !== 11) return `${index + 1}st`
  if (suffix === 2 && (index + 1) % 100 !== 12) return `${index + 1}nd`
  if (suffix === 3 && (index + 1) % 100 !== 13) return `${index + 1}rd`
  return `${index + 1}th`
}

export const initialPlayerSteps: PlayerData = {
  waveStart: "",
  waveEnd: "",
  description: "",
}

export const maxWaves = (gamemode: string, inGameGamemode: string): number => {
  return gamemode === "hardcore"
    ? 50
    : gamemode === "special"
    ? 40
    : gamemode === "normal" && inGameGamemode === "easy"
    ? 20
    : inGameGamemode === "intermediate"
    ? 30
    : 40
}
