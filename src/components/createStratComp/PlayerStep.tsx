import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { PlayerSteps, PlayerData, StrategyType, Map } from "../types"

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
import { Checkbox } from "@/components/ui/checkbox"
import { StratRef } from "../dashboard/Props"
import { Consumables, Towers } from "../itemsList"

type PlayerStepProps = {
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

const PlayerStep = forwardRef<StratRef, PlayerStepProps>(
  (
    {
      player,
      setStrat,
      playerData,
      initialPlayerSteps,
      maxWaves,
      setNextCheck,
      nextCheck,
      mode,
      gamemode,
    }: PlayerStepProps,
    ref
  ) => {
    const [endWaves, setEndWaves] = useState<number[]>([])
    const [startWaves, setStartWaves] = useState<number[]>([])
    const [highestWave, setHighestWave] = useState<number>(1)
    const [descriptions, setDescriptions] = useState<string[]>([])
    const [error, setError] = useState<boolean>(false)
    const [consumableCheck, setConsumableCheck] = useState<boolean>(false)
    const debounceTimer = useRef<NodeJS.Timeout | null>(null)
    const [localPlayerData, setLocalPlayerData] = useState(playerData)
    // Calculate the minimum start wave based on previous ranges
    const getMinStartWave = (index?: number) => {
      if (index === 0) {
        return 1
      }
      if (index && playerData.steps[index - 1]?.waveEnd) {
        return Number(playerData.steps[index - 1]?.waveEnd) + 1
      } else if (endWaves.length === 0) return 1 // Start from 1 if no waves are selected
      const lastEndWave = endWaves[endWaves.length - 1]
      if (lastEndWave === maxWaves) return maxWaves
      return lastEndWave + 1 // Minimum start wave is one more than the last end wave
    }

    const addWave = () => {
      setError(false)
      if (mode === "edit") {
        const lastStep = localPlayerData.steps[localPlayerData.steps.length - 1] // Get the last step
        const newWaveStart = lastStep ? Number(lastStep.waveEnd) + 1 : 1
        const newStep = {
          ...initialPlayerSteps,
          waveStart: newWaveStart.toString(),
        }
        setLocalPlayerData({
          ...localPlayerData,
          steps: [...localPlayerData.steps, newStep], // Append new step to the selected player's steps
        })
      } else {
        setStrat((prev) => ({
          ...prev,
          players: prev.players?.map((p, index) => {
            if (index === player) {
              const lastStep = p.steps[p.steps.length - 1] // Get the last step
              const newWaveStart = lastStep ? Number(lastStep.waveEnd) + 1 : 1
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
          }), // Add a new empty PlayerSteps object with an initialiser
        }))
      }
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

      if (mode === "edit") {
        if (localPlayerData === undefined) {
          setLocalPlayerData({
            playerNo: player + 1,
            consumables:
              gamemode.toLowerCase() === "hardcore" ? [] : ["", "", "", "", ""],
            towers: ["", "", "", "", ""],
            steps: [initialPlayerSteps],
          })
        } else if (
          updatedEndWaves.length === 0 &&
          localPlayerData?.steps[0]?.waveEnd
        ) {
          if (
            !localPlayerData.consumables ||
            localPlayerData.consumables.length === 0
          ) {
            setLocalPlayerData((prev) => ({
              ...prev,
              consumables:
                gamemode.toLowerCase() === "hardcore"
                  ? []
                  : ["", "", "", "", ""],
            }))
          }

          // Update start and end waves based on the localPlayerData steps
          for (let i = 0; i < localPlayerData.steps.length; i++) {
            if (Number(localPlayerData.steps[i].waveEnd)) {
              updatedEndWaves[i] = Number(localPlayerData.steps[i].waveEnd)
            }
            if (Number(localPlayerData.steps[i].waveStart)) {
              updatedStartWaves[i] = Number(localPlayerData.steps[i].waveStart)
            } else if (Number(localPlayerData.steps[i].waveEnd)) {
              updatedStartWaves[i] = Number(localPlayerData.steps[i].waveEnd)
            }
          }

          setEndWaves(updatedEndWaves)
          setStartWaves(updatedStartWaves)
          setHighestWave(Math.max(...updatedEndWaves))
        }
      } else {
        if (playerData === undefined) {
          setStrat((prev) => {
            const updatedPlayers = [...(prev.players ?? [])] // Copy the players array

            // Ensures we're adding the player at the correct index
            updatedPlayers[player] = {
              playerNo: player + 1,
              consumables:
                gamemode.toLowerCase() === "hardcore"
                  ? []
                  : ["", "", "", "", ""],
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
          playerData?.steps[0]?.waveEnd
        ) {
          if (!playerData.consumables || playerData.consumables.length === 0) {
            setStrat((prev) => {
              const updatedPlayers = [...(prev.players ?? [])] // Copy the players array

              // Ensures we're adding the player at the correct index
              updatedPlayers[player] = {
                ...updatedPlayers[player],
                consumables:
                  gamemode.toLowerCase() === "hardcore"
                    ? []
                    : ["", "", "", "", ""],
              }

              return {
                ...prev,
                players: updatedPlayers, // Replace players with the updated array
              }
            })
          }

          for (let i = 0; i < playerData.steps.length; i++) {
            if (Number(playerData.steps[i].waveEnd)) {
              updatedEndWaves[i] = Number(playerData.steps[i].waveEnd)
            }
            if (Number(playerData.steps[i].waveStart)) {
              updatedStartWaves[i] = Number(playerData.steps[i].waveStart)
            } else if (Number(playerData.steps[i].waveEnd)) {
              updatedStartWaves[i] = Number(playerData.steps[i].waveEnd)
            }
          }
          setEndWaves(updatedEndWaves)
          setStartWaves(updatedStartWaves)
          setHighestWave(Math.max(...updatedEndWaves))
        }
      }
    }, [])

    useEffect(() => {
      if (nextCheck && nextCheck[playerKey] === true) {
        const lastWaveIndex = playerData?.steps?.length - 1
        let missingDescription = false
        let missingTowers = false
        for (let i = 0; i < playerData.steps.length; i++) {
          if (!playerData.steps[i].description) {
            missingDescription = true
            break
          }
        }
        for (let i = 0; i < playerData.towers.length; i++) {
          if (!playerData.towers[i]) {
            missingTowers = true
            break
          }
        }
        if (
          setNextCheck &&
          (Number(playerData.steps[lastWaveIndex].waveEnd) !== maxWaves ||
            missingDescription === true ||
            missingTowers === true)
        ) {
          setNextCheck((prev) => ({
            ...prev,
            [playerKey]: false,
          }))
        }
      }
    }, [playerData])

    // Handle form submission
    const handleAddWave = (playerData: PlayerSteps) => {
      if (playerData.steps[0].waveEnd) {
        for (let i = 0; i < playerData.steps.length; i++) {
          if (
            !playerData.steps[i].waveEnd ||
            !playerData.steps[i].description
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
      }
    }

    const validateWaveData = (playerData: PlayerSteps) => {
      if (!playerData.steps[0].waveEnd) return false

      for (const step of playerData.steps) {
        if (!step.waveEnd || !step.description) return false
      }

      return true
    }

    const handleNext = (e: React.FormEvent) => {
      e.preventDefault()
      setError(false)

      if (!playerData.towers.every(Boolean) || !validateWaveData(playerData)) {
        setError(true)
        return
      }
      if (setNextCheck) {
        setNextCheck((prev) => ({
          ...prev,
          [playerKey]: true,
        }))
      }
    }

    const handleWaveChange = (
      value: number,
      index: number,
      step: PlayerData
    ) => {
      // Set player steps based on selection

      const updatedEndWaves = [...endWaves] // Copy the current endWaves
      // Update the index with the new value

      updatedEndWaves[index] = value

      for (let i = index; i < updatedEndWaves.length; i++) {
        if (updatedEndWaves[i - 1] === maxWaves) {
          const filteredEndWaves = updatedEndWaves.filter(
            (wave, p) => p <= i - 1
          )
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
        } else if (
          (mode === "edit" && localPlayerData.steps[i]) ||
          (mode !== "edit" && playerData.steps[i])
        ) {
          updatedStartWaves[i + 1] = updatedEndWaves[i] + 1
        }
      }

      setStartWaves(updatedStartWaves) // Set updated start waves
      return updatedStartWaves // Return the updated start waves
    }

    useImperativeHandle(ref, () => ({
      submit: () => {
        if (
          !localPlayerData.towers.every(Boolean) ||
          !validateWaveData(localPlayerData)
        ) {
          setError(true)
          return
        }
        transferDataToStrat()
        return localPlayerData
      },
    }))
    const transferDataToStrat = () => {
      setStrat((prev) => {
        const updatedPlayers = prev.players?.map((playerData, index) => {
          if (index === player) {
            // Only update the player at the specified index
            return {
              ...playerData,
              playerNo: localPlayerData.playerNo,
              steps: localPlayerData.steps, // Update the steps with localPlayerData
              towers: localPlayerData.towers, // Update the towers with localPlayerData
              consumables: localPlayerData.consumables, // Update the consumables with localPlayerData
            }
          }
          return playerData // Return unchanged player for others
        })

        return {
          ...prev, // Keep other strat properties intact
          players: updatedPlayers, // Replace the players array with the updated one
        }
      })
    }

    const updatePlayer = (
      updatedStartWaves: number[],
      updatedEndWaves: number[]
    ) => {
      let deleteRemaining = false
      // Check if we're in edit mode and handle localPlayerData
      if (mode === "edit") {
        setLocalPlayerData((prev) => {
          const updatedSteps = prev?.steps
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

          return {
            ...prev,
            steps: updatedSteps,
          }
        })
      } else {
        // When not in "edit" mode, update the global state (strat)
        const updatedPlayerSteps = playerData.steps
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
          const updatedPlayers = [...(prev.players as PlayerSteps[])] // Copy the players array

          // Update the specific player's steps at the index `player`
          updatedPlayers[player] = {
            ...(prev.players as PlayerSteps[])[player],
            steps: updatedPlayerSteps,
          }

          return {
            ...prev,
            players: updatedPlayers, // Replace players with updated array
          }
        })
      }
    }

    const handleTextChange = (
      e: ChangeEvent<HTMLTextAreaElement>,
      index: number
    ) => {
      const { value } = e.target
      setDescriptions((prev) => {
        const updatedDescriptions = [...prev]
        updatedDescriptions[index] = value // Update the description at the specified index
        return updatedDescriptions
      })

      if (mode === "edit") {
        handleDescriptionChange(value, index)
      } else {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current)
        }

        // Set a new timer to call the handleDescriptionChange function after 2 seconds
        debounceTimer.current = setTimeout(() => {
          handleDescriptionChange(value, index) // Call the debounced function
        }, 300)
      }
    }

    const handleDescriptionChange = (value: string, index: number) => {
      if (mode === "edit") {
        // Edit mode: update the local player data
        setLocalPlayerData((prev) => {
          const updatedSteps = [...prev.steps]
          updatedSteps[index] = { ...updatedSteps[index], description: value }

          return {
            ...prev,
            steps: updatedSteps, // Only return steps as you have no `players` field here
          }
        })
      } else {
        // Non-edit mode: update the global strategy data
        setStrat((prev) => {
          const updatedPlayers = [...(prev.players as PlayerSteps[])]
          const updatedSteps = [...updatedPlayers[player].steps] // Make sure `player` is the correct player index

          updatedSteps[index] = { ...updatedSteps[index], description: value }
          updatedPlayers[player] = {
            ...updatedPlayers[player],
            steps: updatedSteps,
          }

          return {
            ...prev,
            players: updatedPlayers, // Update only the specific player in the players array
          }
        })
      }
    }

    const handleTowerChange = (value: string, index: number) => {
      if (mode === "edit") {
        // In edit mode, update the local player data
        setLocalPlayerData((prev) => ({
          ...prev,
          towers: prev.towers.map((tower, i) => (i === index ? value : tower)), // Update specific tower in localPlayerData
        }))
      } else {
        // In non-edit mode, update the global strat state
        setStrat((prev) => {
          const updatedPlayers = [...(prev.players as PlayerSteps[])] // Copy the players array

          // Update the specific player's towers
          updatedPlayers[player] = {
            ...updatedPlayers[player],
            towers: updatedPlayers[player].towers.map(
              (tower, i) => (i === index ? value : tower) // Update the tower at the given index
            ),
          }

          return {
            ...prev,
            players: updatedPlayers, // Replace players with updated array
          }
        })
      }
    }

    const handleConsumableChange = (value: string, index: number) => {
      if (mode === "edit") {
        // In edit mode, update the local player data
        setLocalPlayerData((prev) => ({
          ...prev,
          consumables: prev.consumables.map(
            (consumable, i) => (i === index ? value : consumable) // Update specific consumable in localPlayerData
          ),
        }))
      } else {
        // In non-edit mode, update the global strat state
        setStrat((prev) => {
          const updatedPlayers = [...(prev.players as PlayerSteps[])] // Copy the players array

          // Update the specific player's consumables
          updatedPlayers[player] = {
            ...updatedPlayers[player],
            consumables: updatedPlayers[player].consumables.map(
              (consumable, i) => (i === index ? value : consumable) // Update the consumable at the given index
            ),
          }

          return {
            ...prev,
            players: updatedPlayers, // Replace players with updated array
          }
        })
      }
    }

    return (
      <form>
        <h1 className="justify-center flex mb-6 text-base font-bold">
          Steps for Player {player + 1}
        </h1>
        <div className="flex flex-col justify-center">
          {/* Towers Section */}
          <div className="flex flex-row items-center mb-5 flex-wrap lg:flex-nowrap space-x-1 space-y-1">
            <span>Towers: </span>
            {(mode === "edit" ? localPlayerData : playerData)?.towers?.map(
              (tower, index) => (
                <div key={index}>
                  <Select
                    value={tower || ""}
                    onValueChange={(value) => {
                      if (value === "CANCEL") {
                        handleTowerChange("", index)
                      } else {
                        handleTowerChange(value, index)
                      }
                    }}
                  >
                    <SelectTrigger
                      className={`w-full min-w-[165px] ${
                        error &&
                        !(mode === "edit" ? localPlayerData : playerData)
                          ?.towers?.[index]
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
                            !(
                              mode === "edit" ? localPlayerData : playerData
                            )?.towers?.includes(t) || t === tower
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
              )
            )}
          </div>

          {gamemode.toLowerCase() !== "hardcore" && (
            <div>
              <div className="flex flex-row max-w-xl items-center mb-5 flex-wrap lg:flex-nowrap space-x-1 space-y-1">
                <span>Consumables: </span>
                {(mode === "edit"
                  ? localPlayerData
                  : playerData
                )?.consumables?.map((consumable, index) => (
                  <div
                    key={index}
                    style={{
                      visibility: consumableCheck ? "hidden" : "visible",
                    }}
                  >
                    <Select
                      value={consumable || ""}
                      onValueChange={(value) => {
                        if (value === "CANCEL") {
                          handleConsumableChange("", index)
                        } else {
                          handleConsumableChange(value, index)
                        }
                      }}
                    >
                      <SelectTrigger
                        className={`w-auto min-w-[165px] max-w-[170px]`}
                      >
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
                              !(
                                mode === "edit" ? localPlayerData : playerData
                              )?.consumables?.includes(c) || c === consumable
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

              {/* Checkbox Section */}
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
            </div>
          )}

          {/* Waves and Descriptions Section */}
          <div className="flex flex-col items-center w-full">
            {(mode === "edit" ? localPlayerData : playerData)?.steps?.map(
              (step, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row lg:flex-nowrap w-full lg:space-x-2 space-y-2 lg:space-y-2"
                >
                  <hr className="border-t-2 border-solid border-primary mt-4 mb-2 lg:hidden" />
                  <div className="flex items-center flex-wrap lg:flex-nowrap lg:space-x-2">
                    <span className="w-full lg:w-auto">Waves: </span>
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

                    <span className="w-full lg:w-auto">to</span>
                    <Select
                      value={step.waveEnd}
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
                                ? step.waveStart &&
                                  wave >= Number(step.waveStart)
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
                  </div>
                  <div className="flex items-center flex-wrap lg:flex-nowrap lg:space-x-2 w-full">
                    <span>Description: </span>
                    <Textarea
                      placeholder="What does the player need to do on these waves?"
                      className={`bg-white resize-none focus:outline-none focus:ring-2 ${
                        !step.description && error
                          ? "border-red-500 ring-red-500 border-solid focus:border-blue-500"
                          : "focus:ring-blue-500"
                      }`}
                      value={descriptions[index] ?? step.description}
                      onChange={(e) => handleTextChange(e, index)}
                    />
                  </div>
                </div>
              )
            )}

            {highestWave < maxWaves && (
              <Button
                type="button"
                className="mt-4"
                onClick={() =>
                  handleAddWave(mode === "edit" ? localPlayerData : playerData)
                }
              >
                Add Additional Step
              </Button>
            )}
            {highestWave === maxWaves && mode !== "edit" && (
              <Button type="button" className="mt-4" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </form>
    )
  }
)
export default PlayerStep
