import React, { useRef, useState, Suspense, useMemo } from "react"
import EditButtons from "./editButtons"
import { PlayerSteps, StrategyType } from "../Types"
import { initialPlayerSteps } from "../Utils"
import PlayerStepData from "../strategyData/PlayerStepData"
import _isEqual from "lodash/isEqual"

interface StratRef {
  submit: () => void
}

type StratCardsProps<RefType, ComponentProps> = {
  name: string
  stratId: number | undefined
  label: string
  value: string | PlayerSteps | undefined
  componentName: string
  gamemode?: string
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  editName: string
  edit: boolean
  handleEdit: (field: string) => void
  setEditName: React.Dispatch<React.SetStateAction<string>>
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
  player?: number
  playerId?: number
  maxWave?: number
  stratComponentPath: string
  handleCancel?: () => void
  newPlayer?: boolean
  setNewPlayer?: React.Dispatch<React.SetStateAction<boolean>>
  numberOfPlayers?: string
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

const StratCards = <RefType extends StratRef, ComponentProps>({
  name,
  stratId,
  label,
  value,
  componentName,
  gamemode,
  setStrat,
  editName,
  edit,
  handleEdit,
  setEditName,
  setEdit,
  player,
  playerId,
  maxWave,
  stratComponentPath,
  handleCancel,
  newPlayer,
  setNewPlayer,
  numberOfPlayers,
  setError,
}: StratCardsProps<RefType, ComponentProps>) => {
  const stratRef = useRef<RefType>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const originalData = useRef(value)
  const StratComponent = useMemo(
    () =>
      React.memo(
        React.lazy(() => import(`../createStratComp/${stratComponentPath}`))
      ),
    [stratComponentPath]
  )

  const handleSave = async () => {
    const data = await stratRef.current?.submit()
    if (data) {
      const bodyData = playerId
        ? { data, playerId }
        : componentName === "playerSteps"
        ? { playerStep: data, numberOfPlayers: numberOfPlayers }
        : { data }

      setSaving(true)
      if (!_isEqual(data, originalData.current)) {
        const response = await fetch(`/api/strategy/edit/${stratId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        })
        if (response.ok && componentName === "playerSteps") {
          const updatedData = await response.json()

          // Update the state with the new strategy and players data
          setStrat((prev) => ({
            ...prev,
            players: updatedData.players, // Assuming players is part of the response
          }))
        } else {
          setError(
            "Could not save your strategy, please try again. If this persists, please contact the admin"
          )
        }
      }
      setEdit(false)
      setEditName("")
      setSaving(false)
      if (setNewPlayer) {
        setNewPlayer(false)
      }
    }
  }

  const handleDelete = async () => {
    if (
      stratId &&
      numberOfPlayers &&
      confirm("Are you sure you want to delete this strategy?")
    ) {
      setDeleting(true)
      const newNumberOfPlayers = (parseInt(numberOfPlayers) - 1).toString()
      const requestData = { stratId, newNumberOfPlayers }
      await fetch(`/api/strategy/deletePlayer/${playerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
      setStrat((prev) => ({
        ...prev,
        numOfPlayer: newNumberOfPlayers,
        players: prev.players?.filter((player) => player.id !== playerId),
      }))
      setEdit(false)
      setEditName("")
      setDeleting(false)
    }
  }

  const wordToNumberMap: { [key: string]: string } = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
  }

  function convertWordToNumber(word: string): string | undefined {
    const lowerCaseWord = word.toLowerCase() // To handle case insensitivity
    if (!wordToNumberMap[lowerCaseWord]) {
      return word
    } else {
      return wordToNumberMap[lowerCaseWord]
    }
  }

  const componentProps = useMemo(() => {
    return {
      setStrat,
      mode: "edit",
      ...(componentName === "gamemode" && { gamemode: value }),
      ...(componentName === "stratName" && { stratName: value }),
      ...(componentName === "numOfPlayer" && {
        gamemode,
        numOfPlayer:
          typeof value === "string" &&
          convertWordToNumber(value?.toLowerCase() ?? ""),
      }),
      ...(componentName === "stratDescription" && { stratDescription: value }),
      ...(componentName === "difficulty" && { difficulty: value }),
      ...(componentName === "inGameGamemode" && {
        inGameGamemode: value,
      }),
      ...(componentName === "playerSteps" && {
        player,
        playerData: typeof value === "object" ? value : undefined,
        initialPlayerSteps,
        maxWaves: maxWave,
        gamemode: gamemode,
      }),
      ...(componentName === "description" && { stratDescription: value }),
    } as ComponentProps
  }, [componentName, value, player, maxWave]) as ComponentProps
  return (
    <div className="bg-slate-50 rounded-lg shadow-md p-10 flex flex-col justify-center mb-10 space-y-3">
      <h1 className="relative w-fit tracking-tight text-balance font-bold !leading-tight text-gray-900 text-xl md:text-xl lg:text-2xl underline pb-3">
        {label}
      </h1>
      <div
        className={`${
          componentName === "playerSteps" && editName === name && edit
            ? "text-sm"
            : "text-lg md:text-lg lg:text-xl"
        }`}
      >
        {editName === name && edit ? (
          <Suspense fallback={<div>Loading...</div>}>
            <StratComponent ref={stratRef} {...componentProps} />
          </Suspense>
        ) : componentName === "numOfPlayer" && typeof value === "string" ? (
          convertWordToNumber(value?.toLowerCase() ?? "")
        ) : typeof value === "string" ? (
          value
        ) : (
          <PlayerStepData
            playerData={typeof value === "object" ? value : undefined}
            player={player}
            gamemode={gamemode ?? ""}
          />
        )}
      </div>
      {componentName !== "gamemode" && componentName !== "numOfPlayer" && (
        <div>
          <EditButtons
            edit={edit}
            handleSave={handleSave}
            handleEdit={handleEdit}
            setEdit={setEdit}
            name={name}
            editName={editName}
            saving={saving}
            handleCancel={handleCancel}
            newPlayer={newPlayer}
            handleDelete={handleDelete}
            componentName={componentName}
            deleting={deleting}
          />
        </div>
      )}
    </div>
  )
}

export default StratCards
