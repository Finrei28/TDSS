import React, { ChangeEvent, useEffect, useState } from "react"
import { PlayerSteps, PlayerData } from "../types"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "../ui/button"
import Players from "./PlayerNumber"
import { Towers, Consumables } from "../itemsList"
import { Checkbox } from "@/components/ui/checkbox"
import MaxWidthWapper from "../MaxWidthWapper"

type WaveRange = {
  start: number
  end: number
}

type PlayerStepProps = {
  player: number
  setStrat: React.Dispatch<
    React.SetStateAction<{
      name: string
      gamemode: string
      difficulty: string
      description: string
      map: string
      numOfPlayers: string
      inGameGamemode: string
      players: PlayerSteps[]
    }>
  >
  strat: {
    name: string
    gamemode: string
    difficulty: string
    description: string
    map: string
    numOfPlayers: string
    inGameGamemode: string
    players: PlayerSteps[]
  }
  initialPlayerSteps: PlayerData
  maxWaves: number
  setNextCheck: React.Dispatch<
    React.SetStateAction<{
      playerOne: boolean
      playerTwo: boolean
      playerThree: boolean
      playerFour: boolean
    }>
  >
  nextCheck: {
    playerOne: boolean
    playerTwo: boolean
    playerThree: boolean
    playerFour: boolean
  }
}

export default function PlayerStep({
  player,
  setStrat,
  strat,
  initialPlayerSteps,
  maxWaves,
  setNextCheck,
  nextCheck,
}: PlayerStepProps) {
  const [endWave, setEndWave] = useState<number | undefined>()
  const [endWaves, setEndWaves] = useState<number[]>([])
  const [startWaves, setStartWaves] = useState<number[]>([])
  const [highestWave, setHighestWave] = useState<number>(1)
  const [description, setDescription] = useState<string | undefined>()
  const [selectedWaves, setSelectedWaves] = useState<WaveRange[]>([])
  const [error, setError] = useState<boolean>(false)
  const [consumableCheck, setConsumableCheck] = useState<boolean>(false)

  // Calculate the minimum start wave based on previous ranges
  const getMinStartWave = (index?: number) => {
    if (index === 0) {
      return 1
    }
    if (index && strat.players[player].steps[index - 1]?.waveEnd) {
      return Number(strat.players[player].steps[index - 1]?.waveEnd) + 1
    } else if (endWaves.length === 0) return 1 // Start from 1 if no waves are selected
    const lastEndWave = endWaves[endWaves.length - 1]
    if (lastEndWave === maxWaves) return maxWaves
    return lastEndWave + 1 // Minimum start wave is one more than the last end wave
  }

  const addWave = () => {
    setError(false)
    setStrat((prev) => ({
      ...prev,
      players: prev.players.map((p, index) => {
        if (index === player) {
          const lastStep = p.steps[p.steps.length - 1] // Get the last step
          const newWaveStart = lastStep ? Number(lastStep.waveEnd) + 1 : "1"
          const newStep = {
            ...initialPlayerSteps,
            waveStart: newWaveStart.toString(),
          }
          return {
            ...p,
            steps: [...p.steps, newStep], // Append new step to the selected player's steps
          }
        }
        return p // Keep other players unchanged
      }), // Add a new empty PlayerSteps object
    }))
  }

  const getPlayer = () => {
    switch (player) {
      case 0:
        return "playerOne"
      case 1:
        return "playerTwo"
      case 2:
        return "playerThree"
      case 3:
        return "playerFour"
      default:
        return "playerOne"
    }
  }
  const playerKey = getPlayer()

  useEffect(() => {
    const updatedEndWaves = [...endWaves]
    const updatedStartWaves = [...startWaves]

    if (strat.players[player] === undefined) {
      setStrat((prev) => {
        const updatedPlayers = [...prev.players] // Copy the players array

        // Ensure we're adding the player at the correct index
        updatedPlayers[player] = {
          playerNo: player + 1,
          consumables: ["", "", "", "", ""],
          towers: ["", "", "", "", ""],
          steps: [initialPlayerSteps],
        }

        return {
          ...prev,
          players: updatedPlayers, // Replace players with the updated array
        }
      })
    } else if (
      updatedEndWaves.length === 0 &&
      strat.players[player]?.steps[0]?.waveEnd
    ) {
      for (let i = 0; i < strat.players[player].steps.length; i++) {
        if (Number(strat.players[player].steps[i].waveEnd)) {
          updatedEndWaves[i] = Number(strat.players[player].steps[i].waveEnd)
        }
        if (Number(strat.players[player].steps[i].waveStart)) {
          updatedStartWaves[i] = Number(
            strat.players[player].steps[i].waveStart
          )
        } else if (Number(strat.players[player].steps[i].waveEnd)) {
          updatedStartWaves[i] = Number(strat.players[player].steps[i].waveEnd)
        }
      }
      setEndWaves(updatedEndWaves)
      setStartWaves(updatedStartWaves)
      setHighestWave(Math.max(...updatedEndWaves))
    }
  }, [])

  useEffect(() => {
    if (nextCheck[playerKey] === true) {
      const lastWaveIndex = strat.players[player]?.steps?.length - 1
      let missingDescription = false
      let missingTowers = false
      for (let i = 0; i < strat.players[player].steps.length; i++) {
        if (!strat.players[player].steps[i].description) {
          missingDescription = true
          break
        }
      }
      for (let i = 0; i < strat.players[player].towers.length; i++) {
        if (!strat.players[player].towers[i]) {
          missingTowers = true
          break
        }
      }
      if (
        Number(strat.players[player].steps[lastWaveIndex].waveEnd) !==
          maxWaves ||
        missingDescription === true ||
        missingTowers === true
      )
        setNextCheck((prev) => ({
          ...prev,
          [playerKey]: false,
        }))
    }
  }, [strat.players[player]])

  // Handle form submission
  const handleAddWave = () => {
    if (strat.players[player].steps[0].waveEnd) {
      for (let i = 0; i < strat.players[player].steps.length; i++) {
        if (
          !strat.players[player].steps[i].waveEnd ||
          !strat.players[player].steps[i].description
        ) {
          setError(true)
          return
        }
      }
    } else {
      setError(true)
      return
    }

    if (getMinStartWave() && getMinStartWave() <= 50) {
      addWave()
      setEndWave(undefined)
      setDescription(undefined)
    }
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    for (let i = 0; i < strat.players[player].towers.length; i++) {
      if (!strat.players[player].towers[i]) {
        setError(true)
        return
      }
    }

    if (strat.players[player].steps[0].waveEnd) {
      for (let i = 0; i < strat.players[player].steps.length; i++) {
        if (
          !strat.players[player].steps[i].waveEnd ||
          !strat.players[player].steps[i].description
        ) {
          setError(true)
          return
        }
      }
    } else {
      setError(true)
      return
    }

    setNextCheck((prev) => ({
      ...prev,
      [playerKey]: true,
    }))
  }

  const handleWaveChange = (value: number, index: number, step: PlayerData) => {
    // Set player steps based on selection

    const updatedEndWaves = [...endWaves] // Copy the current endWaves
    // Update the index with the new value

    updatedEndWaves[index] = value

    for (let i = index; i < updatedEndWaves.length; i++) {
      if (updatedEndWaves[i - 1] === maxWaves) {
        const filteredEndWaves = updatedEndWaves.filter((wave, p) => p <= i - 1)
        setEndWaves(filteredEndWaves)
        break
      } else if (
        updatedEndWaves[i] >= updatedEndWaves[i + 1] &&
        updatedEndWaves[i] !== maxWaves
      ) {
        updatedEndWaves[i + 1] = updatedEndWaves[i] + 1
      } else {
        setEndWaves(updatedEndWaves)
      }
    }

    const updatedStartWaves = updateStartWaves(updatedEndWaves, index)

    setEndWave(value)
    updatePlayer(updatedStartWaves, updatedEndWaves)
    setHighestWave(Math.max(...updatedEndWaves))
  }

  const updateStartWaves = (updatedEndWaves: number[], index: number) => {
    const updatedStartWaves = [...startWaves] // Copy the current startWaves

    if (index === 0) {
      updatedStartWaves[index] = 1
    }

    for (let i = index; i < updatedEndWaves.length; i++) {
      if (updatedEndWaves[i - 1] === maxWaves) {
        const filteredStartWaves = updatedStartWaves.filter(
          (wave, p) => p <= i - 1
        )
        setStartWaves(filteredStartWaves) // Set filtered start waves
        return filteredStartWaves // Return filtered start waves
      } else if (strat.players[player].steps[i]) {
        updatedStartWaves[i + 1] = updatedEndWaves[i] + 1
      }
    }

    setStartWaves(updatedStartWaves) // Set updated start waves
    return updatedStartWaves // Return the updated start waves
  }

  const updatePlayer = (
    updatedStartWaves: number[],
    updatedEndWaves: number[]
  ) => {
    let deleteRemaining = false
    const updatedPlayerSteps = strat.players[player].steps
      .map((step, i) => {
        // Check if we should delete the step
        if (deleteRemaining || updatedEndWaves[i - 1] === maxWaves) {
          deleteRemaining = true // Set flag to true to delete all subsequent steps
          return null
        }
        return {
          ...step,
          waveEnd: updatedEndWaves[i]?.toString(),
          waveStart: updatedStartWaves[i]?.toString(),
        }
      })
      .filter((step) => step !== null) // Filter out deleted steps (null values)

    setStrat((prev) => {
      const updatedPlayers = [...prev.players] // Copy the players array

      // Update the specific player's steps at the index `player`
      updatedPlayers[player] = {
        ...prev.players[player],
        steps: updatedPlayerSteps,
      }

      return {
        ...prev,
        players: updatedPlayers, // Replace players with updated array
      }
    })
  }

  const handleTextChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = e.target

    const updatedPlayerSteps = strat.players[player].steps.map((step, i) =>
      i === index ? { ...step, description: value } : step
    )
    setStrat((prev) => {
      const updatedPlayers = [...prev.players] // Copy the players array

      // Update the specific player's steps at the index `player`
      updatedPlayers[player] = {
        ...prev.players[player],
        steps: updatedPlayerSteps,
      }

      return {
        ...prev,
        players: updatedPlayers, // Replace players with updated array
      }
    })
    setDescription(value)
  }

  const handleTowerChange = (value: string, index: number) => {
    const updatedPlayerTowers = strat.players[player].towers.map(
      (tower, i) => (i === index ? value : tower) // Update the specific tower based on the index
    )
    setStrat((prev) => ({
      ...prev,
      players: prev.players.map(
        (p, i) => (i === player ? { ...p, towers: updatedPlayerTowers } : p) // Only update the current player's towers
      ),
    }))
  }

  const handleConsumableChange = (value: string, index: number) => {
    const updatedPlayerConsumables = strat.players[player].consumables.map(
      (consumable, i) => (i === index ? value : consumable) // Update the specific tower based on the index
    )
    setStrat((prev) => ({
      ...prev,
      players: prev.players.map(
        (p, i) =>
          i === player ? { ...p, consumables: updatedPlayerConsumables } : p // Only update the current player's towers
      ),
    }))
  }

  return (
    <form>
      <h1 className="justify-center flex mb-6 text-base font-bold">
        Steps for Player {player + 1}
      </h1>
      <div className="flex flex-col justify-center">
        <div className="flex flex-row items-center mb-5 flex-wrap lg:flex-nowrap space-x-1 space-y-1">
          <span>Towers: </span>
          {strat.players[player]?.towers?.map((tower, index) => (
            <div key={index}>
              <Select
                value={tower || ""} // This will show the selected tower
                onValueChange={(value) => {
                  // Check for cancel selection
                  if (value === "CANCEL") {
                    handleTowerChange("", index) // Clear the selection
                  } else {
                    handleTowerChange(value, index)
                  }
                }}
              >
                <SelectTrigger
                  className={`w-auto lg:w-[180px] ${
                    error && !tower
                      ? "border-red-500 ring-red-500 border-solid focus:border-blue-500"
                      : "focus:ring-blue-500"
                  }`}
                >
                  <SelectValue placeholder="Select a tower" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tower {index + 1}</SelectLabel>
                    <SelectItem
                      key={`cancel-${index}`}
                      value="CANCEL"
                      className="text-red-500 hover:bg-red-500 focus:bg-red-500 focus:text-white hover:cursor-pointer"
                    >
                      CANCEL SELECTION
                    </SelectItem>
                    {Towers.filter(
                      (t) =>
                        // Allow the currently selected tower to be displayed
                        !strat.players[player].towers.includes(t) || t === tower
                    ).map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        className="hover:cursor-pointer"
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <div className="flex flex-row max-w-xl items-center mb-5 flex-wrap lg:flex-nowrap space-x-1 space-y-1">
          <span>Consumables: </span>
          {strat.players[player]?.consumables?.map((consumable, index) => (
            <div
              key={index}
              style={{ visibility: consumableCheck ? "hidden" : "visible" }}
            >
              <Select
                value={consumable || ""}
                onValueChange={(value) => {
                  // Check for cancel selection
                  if (value === "CANCEL") {
                    handleConsumableChange("", index) // Clear the selection
                  } else {
                    handleConsumableChange(value, index)
                  }
                }}
              >
                <SelectTrigger className={`w-auto lg:w-[172px]`}>
                  <SelectValue placeholder="Select a consumable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Consumable {index + 1}</SelectLabel>
                    <SelectItem
                      key={`cancel-${index}`}
                      value="CANCEL"
                      className="text-red-500 hover:bg-red-500 focus:bg-red-500 focus:text-white hover:cursor-pointer"
                    >
                      CANCEL SELECTION
                    </SelectItem>
                    {Consumables.filter(
                      (c) =>
                        !strat.players[player].consumables.includes(c) ||
                        c === consumable
                    ).map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="hover:cursor-pointer"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="consumables"
            checked={consumableCheck}
            onCheckedChange={() => setConsumableCheck((prev) => !prev)}
          />
          <label
            htmlFor="consumables"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            No consumables required
          </label>
        </div>
        <div className="flex flex-col items-center w-full">
          {strat.players[player] &&
            strat.players[player].steps?.map((step, index) => (
              <div
                key={index}
                className="flex items-center mb-4 space-x-4 w-full"
              >
                <span>Waves: </span>

                <Select
                  value={
                    step.waveStart
                      ? step.waveStart
                      : getMinStartWave(index).toString()
                  }
                  disabled
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Starting Wave</SelectLabel>
                      <SelectItem
                        value={
                          step.waveStart
                            ? step.waveStart
                            : getMinStartWave(index).toString()
                        }
                      >
                        {step.waveStart
                          ? step.waveStart
                          : getMinStartWave(index).toString()}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <label className="flex items-center space-x-4">
                  <span>to</span>
                  <Select
                    value={step.waveEnd ? step.waveEnd : ""}
                    onValueChange={(value) =>
                      handleWaveChange(Number(value), index, step)
                    }
                  >
                    <SelectTrigger
                      className={`w-[180px] ${
                        error && !step.waveEnd
                          ? "border-red-500 ring-red-500 border-solid focus:border-blue-500"
                          : "focus:ring-blue-500"
                      }`}
                    >
                      <SelectValue placeholder="Ending Wave" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Ending Wave</SelectLabel>
                        {Array.from({ length: maxWaves }, (_, i) => i + 1)
                          .filter((wave) =>
                            step.waveStart
                              ? step.waveStart && wave >= Number(step.waveStart)
                              : getMinStartWave(index) &&
                                wave >= getMinStartWave(index)
                          )
                          .map((wave) => (
                            <SelectItem key={wave} value={wave.toString()}>
                              {wave}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </label>

                <span>Description: </span>
                <Textarea
                  placeholder="What does the player need to do on these waves?"
                  className={`bg-white resize-none focus:outline-none focus:ring-2 ${
                    !step.description && error
                      ? "border-red-500 ring-red-500 border-solid focus:border-blue-500"
                      : "focus:ring-blue-500" // Optional: add custom ring color when valid
                  }`}
                  value={step.description}
                  onChange={(e) => handleTextChange(e, index)}
                />
              </div>
            ))}

          {highestWave < maxWaves && (
            <Button type="button" className="mt-4" onClick={handleAddWave}>
              Add Additional Step
            </Button>
          )}
          {highestWave === maxWaves && (
            <Button type="button" className="mt-4" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
