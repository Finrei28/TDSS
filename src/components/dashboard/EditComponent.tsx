"use client"

import React, { useState } from "react"
import { useFetchData } from "@/components/UseEffect"
import { maxWaves } from "@/components/Utils"
import { ErrorMessageProps } from "../ClientUtils"
import { useParams } from "next/navigation"
import { PlayerSteps, StrategyType, Map } from "../Types"
import MaxWidthWapper from "../MaxWidthWapper"
import Loader from "../Loader"
import OrdinalTitle from "./OrdinalTitle"

import StratCards from "./StratCards"
import {
  DescriptionProps,
  DifficultyProps,
  GamemodeProps,
  InGameGamemodeProps,
  numOfPlayerProps,
  PlayerStepProps,
  StratNameProps,
  StratRef,
} from "./Props"

import Image from "next/image"
import { Button } from "../ui/button"
import { ErrorMessage } from "../ui/MessageBox"

type EditComponentProps = {
  userId: string
}

const EditComponent = ({ userId }: EditComponentProps) => {
  const { stratId } = useParams()
  const [strategy, setStrategy] = useState<StrategyType>({
    name: "",
    gamemode: "",
    difficulty: "",
    description: "",
    map: {} as Map,
    numOfPlayer: "",
    inGameGamemode: "",
    players: [] as PlayerSteps[],
  })
  const [loading, setLoading] = useState(true)
  const { error, setError, closeErrorMessage } = ErrorMessageProps()
  const [editName, setEditName] = useState("")
  const [edit, setEdit] = useState(false)
  const [newPlayer, setNewPlayer] = useState(false)
  const handleEdit = (name: string) => {
    if (newPlayer) {
      return
    }
    setEditName(name)
    setEdit(true)
  }

  useFetchData(
    `/api/strategy/userStrategy?stratId=${stratId}`,
    setStrategy,
    setLoading
  )

  const handleAddPlayer = () => {
    const player = strategy.numOfPlayer
    setStrategy((prev) => ({
      ...prev,
      numOfPlayer: (parseInt(prev.numOfPlayer) + 1).toString(),
      players: [...(prev.players || []), {} as PlayerSteps],
    }))
    setEditName(`player${player}`)
    setNewPlayer(true)
    setEdit(true)
  }

  const handleCancel = () => {
    setStrategy((prev) => {
      // Ensure players exist before attempting to remove the last one
      if (!prev.players || prev.players.length === 0) {
        return prev
      }

      return {
        ...prev,
        players: prev.players.slice(0, -1), // Remove the last object from the array
        numOfPlayer: (parseInt(prev.numOfPlayer) - 1).toString(), // Update numOfPlayer
      }
    })
    setNewPlayer(false)
  }

  const maxPlayers = strategy.gamemode.toLowerCase() === "hardcore" ? 3 : 4

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-6.25rem)] -mt-14">
          <Loader />
        </div>
      ) : (
        <>
          <div className="fixed bottom-4 ml-4 p-4 z-10">
            {error && (
              <ErrorMessage
                message={error}
                closeErrorMessage={closeErrorMessage}
              />
            )}
          </div>
          {strategy ? (
            <div>
              <div className="text-xl md:text-3xl font-semibold text-gray-700 mb-6">
                <OrdinalTitle userId={userId} />
              </div>

              <MaxWidthWapper className="lg:max-w-screen-lg md:max-w-screen-md ">
                <div className="relative w-full h-64 flex flex-col items-center">
                  <h2 className="text-center text-lg">{strategy.map?.name}</h2>
                  {strategy.map.image && (
                    <Image
                      src={strategy.map.image}
                      alt={strategy.map.name || "Map Image"}
                      width={200}
                      height={200}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                      className="object-cover rounded-md"
                    />
                  )}
                </div>

                <StratCards<StratRef, StratNameProps>
                  name="name"
                  setStrat={setStrategy}
                  stratComponentPath="StratName"
                  stratId={strategy.id}
                  label="Strategy Name"
                  value={strategy.name}
                  componentName="stratName"
                  editName={editName}
                  edit={edit}
                  handleEdit={handleEdit}
                  setEditName={setEditName}
                  setEdit={setEdit}
                  setError={setError}
                />
                <StratCards<StratRef, GamemodeProps>
                  name="gamemode"
                  setStrat={setStrategy}
                  stratComponentPath={"Gamemode"}
                  stratId={strategy.id}
                  label="Gamemode"
                  value={strategy.gamemode}
                  componentName="gamemode"
                  editName={editName}
                  edit={edit}
                  setEdit={setEdit}
                  handleEdit={handleEdit}
                  setEditName={setEditName}
                  setError={setError}
                />
                {strategy.inGameGamemode && (
                  <StratCards<StratRef, InGameGamemodeProps>
                    name="inGameGamemode"
                    setStrat={setStrategy}
                    stratComponentPath={"InGameGamemode"}
                    stratId={strategy.id}
                    label="In Game Difficulty"
                    value={strategy.inGameGamemode}
                    componentName="inGameGamemode"
                    editName={editName}
                    edit={edit}
                    handleEdit={handleEdit}
                    setEditName={setEditName}
                    setEdit={setEdit}
                    setError={setError}
                  />
                )}
                <StratCards<StratRef, numOfPlayerProps>
                  name="numOfPlayer"
                  setStrat={setStrategy}
                  stratComponentPath={"PlayerNumber"}
                  stratId={strategy.id}
                  label="Number of Players"
                  value={strategy.numOfPlayer}
                  gamemode={strategy.gamemode}
                  componentName="numOfPlayer"
                  editName={editName}
                  edit={edit}
                  setEdit={setEdit}
                  handleEdit={handleEdit}
                  setEditName={setEditName}
                  setError={setError}
                />

                {strategy.players?.map((player, index) => (
                  <StratCards<StratRef, PlayerStepProps>
                    key={index}
                    name={`player${index}`}
                    setStrat={setStrategy}
                    stratComponentPath={"PlayerStep"}
                    stratId={strategy.id}
                    label={`Player ${index + 1}`}
                    value={
                      Object.keys(player).length === 0 ? undefined : player
                    }
                    player={index}
                    playerId={player.id}
                    componentName="playerSteps"
                    editName={editName}
                    edit={edit}
                    setEdit={setEdit}
                    handleEdit={handleEdit}
                    setEditName={setEditName}
                    maxWave={maxWaves(
                      strategy.gamemode.toLowerCase(),
                      strategy.inGameGamemode?.toLowerCase() ?? ""
                    )}
                    gamemode={strategy.gamemode}
                    handleCancel={handleCancel}
                    newPlayer={newPlayer}
                    setNewPlayer={setNewPlayer}
                    numberOfPlayers={strategy.numOfPlayer}
                    setError={setError}
                  />
                ))}
                {parseInt(strategy.numOfPlayer) < maxPlayers && (
                  <div className="flex justify-center mb-10">
                    <Button onClick={handleAddPlayer}>Add Player</Button>
                  </div>
                )}

                <StratCards<StratRef, DifficultyProps>
                  name="difficulty"
                  setStrat={setStrategy}
                  stratComponentPath={"Difficulty"}
                  stratId={strategy.id}
                  label="Difficulty"
                  value={strategy.difficulty}
                  componentName="difficulty"
                  editName={editName}
                  edit={edit}
                  setEdit={setEdit}
                  handleEdit={handleEdit}
                  setEditName={setEditName}
                  setError={setError}
                />
                <StratCards<StratRef, DescriptionProps>
                  name="description"
                  setStrat={setStrategy}
                  stratComponentPath={"Description"}
                  stratId={strategy.id}
                  label="Description"
                  value={strategy.description}
                  componentName="description"
                  editName={editName}
                  edit={edit}
                  setEdit={setEdit}
                  handleEdit={handleEdit}
                  setEditName={setEditName}
                  setError={setError}
                />
              </MaxWidthWapper>
            </div>
          ) : (
            <div>No strat</div>
          )}
        </>
      )}
    </div>
  )
}

export default EditComponent
