"use client"

import React, { useEffect, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import dynamic from "next/dynamic"
import MaxWidthWapper from "@/components/MaxWidthWapper"
const Gamemode = dynamic(
  () => import("@/components/createStratComp/Gamemode"),
  {
    loading: () => <p>Loading...</p>, // Optional: a loading component while the dynamic import is being loaded
    ssr: false, // Disables server-side rendering for this component
  }
)
const Map = dynamic(() => import("@/components/createStratComp/Map"), {
  loading: () => <p className="flex justify-center">Loading...</p>, // Optional: a loading component while the dynamic import is being loaded
  ssr: false, // Disables server-side rendering for this component
})
const PlayerNumber = dynamic(
  () => import("@/components/createStratComp/PlayerNumber"),
  {
    loading: () => <p>Loading...</p>, // Optional: a loading component while the dynamic import is being loaded
    ssr: false, // Disables server-side rendering for this component
  }
)
const PlayerStep = dynamic(
  () => import("@/components/createStratComp/PlayerStep"),
  {
    loading: () => <p>Loading...</p>, // Optional: a loading component while the dynamic import is being loaded
    ssr: false, // Disables server-side rendering for this component
  }
)
const InGameGamemode = dynamic(
  () => import("@/components/createStratComp/InGameGamemode"),
  {
    loading: () => <p>Loading...</p>, // Optional: a loading component while the dynamic import is being loaded
    ssr: false, // Disables server-side rendering for this component
  }
)
const Difficulty = dynamic(
  () => import("@/components/createStratComp/Difficulty"),
  {
    loading: () => <p>Loading...</p>, // Optional: a loading component while the dynamic import is being loaded
    ssr: false, // Disables server-side rendering for this component
  }
)
const Description = dynamic(
  () => import("@/components/createStratComp/Description"),
  {
    loading: () => <p>Loading...</p>, // Optional: a loading component while the dynamic import is being loaded
    ssr: false, // Disables server-side rendering for this component
  }
)
const ConfirmationModal = dynamic(
  () => import("@/components/ConfirmationModal"),
  {
    ssr: false, // Disables server-side rendering for this component
  }
)

import { PlayerSteps, StrategyType } from "@/components/types"
import StratName from "@/components/createStratComp/StratName"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { ErrorMessage, SuccessMessage } from "@/components/ui/MessageBox"
import { initialPlayerSteps, maxWaves } from "@/components/utils"
import { ErrorMessageProps } from "@/components/ClientUtils"

const createstrategy = () => {
  const [strat, setStrat] = useState<StrategyType>({
    name: "",
    gamemode: "",
    difficulty: "",
    description: "",
    map: { name: "" },
    numOfPlayer: "",
    inGameGamemode: "",
    players: [] as PlayerSteps[],
  })

  const [nameCheck, setNameCheck] = useState(false)
  const [descriptionCheck, setDescriptionCheck] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const { error, setError, closeErrorMessage } = ErrorMessageProps()

  const [nextCheck, setNextCheck] = useState({
    playerOne: false,
    playerTwo: false,
    playerThree: false,
    playerFour: false,
  })

  const { data: session } = useSession()

  useEffect(() => {
    const storedStrat = sessionStorage.getItem("stratData")
    if (storedStrat) {
      setStrat(JSON.parse(storedStrat))
      setNextCheck({
        playerOne: true,
        playerTwo: true,
        playerThree: true,
        playerFour: true,
      })
      setDescriptionCheck(true)
    }
  }, [])

  const getMaxPlayers = () => {
    switch (strat.numOfPlayer) {
      case "1":
        return "playerOne"
      case "2":
        return "playerTwo"
      case "3":
        return "playerThree"
      case "4":
        return "playerFour"
      default:
        return "playerOne"
    }
  }
  const MaxPlayerKey = getMaxPlayers()

  const getPlayers = (i: number) => {
    switch (i) {
      case 1:
        return "playerOne"
      case 2:
        return "playerTwo"
      case 3:
        return "playerThree"
      case 4:
        return "playerFour"
      default:
        return undefined
    }
  }

  const closeModal = () => {
    setIsModalOpen(false) // Function to close the modal
  }

  const handleTrySubmit = () => {
    sessionStorage.setItem("stratData", JSON.stringify(strat))
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/addStrategy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(strat), // Send strat data to the backend API
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message)
      }
      sessionStorage.removeItem("stratData")
      setSuccess(true)
      setStrat({
        name: "",
        gamemode: "",
        difficulty: "",
        description: "",
        map: { name: "" },
        numOfPlayer: "",
        inGameGamemode: "",
        players: [] as PlayerSteps[],
      })
      setNextCheck({
        playerOne: false,
        playerTwo: false,
        playerThree: false,
        playerFour: false,
      })
      setNameCheck(false)
      closeModal()
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
      const data = await response.json()
    } catch (error) {
      setError("Failed to create strategy, contact the admin if this persists")
    }
  }

  const checkStepsCompleted = (player: string, maxNumber: number) => {
    if (player) {
      let completed = nextCheck[player as keyof typeof nextCheck]
      if (!completed) {
        return false
      }
      for (let i = 1; i < maxNumber; i++) {
        const playerKey = getPlayers(i)
        if (playerKey && !nextCheck[playerKey]) {
          completed = false
          break
        } else {
          completed = true
        }
      }
      return completed
    } else {
      return false
    }
  }

  const stepsCompleted = checkStepsCompleted(
    MaxPlayerKey,
    parseInt(strat.numOfPlayer)
  )

  return (
    <div className="bg-slate-50 min-h-screen -mt-14">
      <section>
        <div className="fixed bottom-4 ml-4 p-4 z-110">
          {success && (
            <SuccessMessage message="You have successfully shared your strategy with the community!" />
          )}
        </div>
        <div className="fixed bottom-4 ml-4 p-4 z-110">
          {error && (
            <ErrorMessage
              message={error}
              closeErrorMessage={closeErrorMessage}
            />
          )}
        </div>

        <MaxWidthWapper className="lg:max-w-screen-lg md:max-w-screen-md pb-24 pt-24 lg:grid sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-28 lg:pb-52">
          <div className="flex flex-col items-center justify-center ">
            <h1 className="relative w-fit tracking-tight text-balance font-bold !leading-tight text-gray-900 text-xl md:text-2xl lg:text-3xl">
              Share your strat with the community!
            </h1>
          </div>
          <Accordion
            type="multiple"
            defaultValue={[
              "item-1",
              "item-2",
              "item-3",
              "item-4",
              "item-5",
              "player-1",
              "player-2",
              "player-3",
              "player-4",
              "item-6",
              "item-7",
            ]}
            className="w-full"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div>
                  <span>Strategy Name:</span>
                  <span className="text-slate-50 ml-2">{strat.name}</span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <StratName
                  setStrat={setStrat}
                  stratName={strat.name}
                  setNameCheck={setNameCheck}
                />
              </AccordionContent>
            </AccordionItem>
            {(nameCheck || strat.name) && (
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div>
                    <span>Gamemode:</span>
                    <span className="text-slate-50 ml-2">
                      {strat.gamemode.toUpperCase()}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Gamemode setStrat={setStrat} gamemode={strat.gamemode} />
                </AccordionContent>
              </AccordionItem>
            )}
            {strat.gamemode === "normal" && (
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div>
                    <span>In Game Difficulty:</span>
                    <span className="text-slate-50 ml-2">
                      {strat.inGameGamemode?.toUpperCase()}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <InGameGamemode
                    setStrat={setStrat}
                    inGameGamemode={strat.inGameGamemode}
                  />
                </AccordionContent>
              </AccordionItem>
            )}

            {((strat.gamemode === "normal" && strat.inGameGamemode) ||
              (strat.gamemode !== "normal" && strat.gamemode)) && (
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div>
                    <span>Map:</span>
                    <span className="text-slate-50 ml-2">
                      {strat.map.name.toUpperCase()}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Map
                    setStrat={setStrat}
                    gamemode={strat.gamemode}
                    map={strat.map}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
            {strat.map.name && (
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  <div>
                    <span>Players:</span>
                    <span className="text-slate-50 ml-2">
                      {strat.numOfPlayer.toUpperCase()}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <PlayerNumber
                    setStrat={setStrat}
                    gamemode={strat.gamemode}
                    numOfPlayer={strat.numOfPlayer}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
            {strat.numOfPlayer &&
              Array.from({ length: parseInt(strat.numOfPlayer) }, (_, i) => {
                // Create an array or mapping of player data

                // Access the correct player based on index i
                const player = getPlayers(i)
                return (
                  (i === 0 ||
                    (player && checkStepsCompleted(player, i) === true)) && (
                    <AccordionItem
                      key={`player-${i + 1}`}
                      value={`player-${i + 1}`}
                    >
                      <AccordionTrigger>
                        Player{" "}
                        {i === 0
                          ? "One"
                          : i === 1
                          ? "Two"
                          : i === 2
                          ? "Three"
                          : "Four"}
                        :
                      </AccordionTrigger>
                      <AccordionContent>
                        {/* Custom content for each player */}
                        <PlayerStep
                          setStrat={setStrat}
                          playerData={
                            strat.players
                              ? strat.players[i]
                              : ({} as PlayerSteps)
                          }
                          player={i}
                          setNextCheck={setNextCheck}
                          nextCheck={nextCheck}
                          initialPlayerSteps={initialPlayerSteps}
                          maxWaves={maxWaves(
                            strat.gamemode.toLowerCase(),
                            strat.inGameGamemode?.toLowerCase() ?? ""
                          )}
                          gamemode={strat.gamemode}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )
                )
              })}

            {MaxPlayerKey && stepsCompleted === true && (
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  <div>
                    <span>Difficulty:</span>
                    <span className="text-slate-50 ml-2">
                      {strat.difficulty.toUpperCase()}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Difficulty
                    setStrat={setStrat}
                    difficulty={strat.difficulty}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
            {strat.difficulty && stepsCompleted === true && (
              <AccordionItem value="item-7">
                <AccordionTrigger>Strategy Description:</AccordionTrigger>

                <AccordionContent>
                  <Description
                    setStrat={setStrat}
                    stratDescription={strat.description}
                    setDescriptionCheck={setDescriptionCheck}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          {descriptionCheck && stepsCompleted === true && (
            <div className="flex justify-center mt-12">
              <Button onClick={handleTrySubmit}>Confirm and Post</Button>
            </div>
          )}
        </MaxWidthWapper>
        {!session && (
          <ConfirmationModal isOpen={isModalOpen} onClose={closeModal} />
        )}
        {session && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={closeModal}
            handleSubmit={handleSubmit}
            strat={strat}
          />
        )}
      </section>
    </div>
  )
}

export default createstrategy
