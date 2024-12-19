import React from "react"
import { PlayerSteps } from "../Types"

type PlayerStepDataProps = {
  playerData?: PlayerSteps
  player?: number
  gamemode: string
}

export default function PlayerStepData({
  playerData,
  player,
  gamemode,
}: PlayerStepDataProps) {
  const filteredConsumables = playerData?.consumables?.filter(
    (item) => item !== ""
  )

  return (
    <>
      {player !== undefined && playerData && (
        <div className="border rounded-lg p-4 bg-white mb-5">
          <h2 className="text-lg font-bold">Player {player + 1}</h2>
          <div className="mt-2">
            <strong>Towers:</strong>
            <ul className="list-disc ml-4 text-base md:text-lg">
              {playerData.towers.map((tower, i) => (
                <li key={i}>{tower}</li>
              ))}
            </ul>
          </div>
          {gamemode.toLowerCase() !== "hardcore" && (
            <div className="mt-2">
              <strong>Consumables:</strong>
              <ul className="list-disc ml-4 text-base md:text-lg">
                {filteredConsumables && filteredConsumables?.length > 0 ? (
                  filteredConsumables.map((consumable, i) => (
                    <li key={i}>{consumable}</li>
                  ))
                ) : (
                  <p>No consumables required</p>
                )}
              </ul>
            </div>
          )}

          {/* Accordion or steps display */}
          <div className="mt-4">
            <details open>
              <summary className="font-semibold cursor-pointer">Waves</summary>
              {playerData.steps.map((step, i) => (
                <div key={i} className="mt-2">
                  <p>
                    <strong>
                      Wave {step.waveStart} - {step.waveEnd}:
                    </strong>{" "}
                    <span className="text-base md:text-lg">
                      {step.description}
                    </span>
                  </p>
                </div>
              ))}
            </details>
          </div>
        </div>
      )}
    </>
  )
}
