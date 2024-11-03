import React from "react"
import { StrategyType } from "../types"

type PlayerStepDataProps = {
  strat: StrategyType
  player: number
}

export default function PlayerStepData({ strat, player }: PlayerStepDataProps) {
  const playerKey = strat.players[player]
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-bold">Player {player + 1}</h2>
      <div className="mt-2">
        <strong>Towers:</strong>
        <ul className="list-disc ml-4">
          {playerKey.towers.map((tower, i) => (
            <li key={i}>{tower}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <strong>Consumables:</strong>
        <ul className="list-disc ml-4">
          {playerKey.consumables.length > 0 ? (
            playerKey.consumables.map((consumable, i) => (
              <li key={i}>{consumable}</li>
            ))
          ) : (
            <p>No consumables required</p>
          )}
        </ul>
      </div>

      {/* Accordion or steps display */}
      <div className="mt-4">
        <details open>
          <summary className="font-semibold cursor-pointer">Waves</summary>
          {playerKey.steps.map((step, i) => (
            <div key={i} className="mt-2">
              <p>
                <strong>
                  Wave {step.waveStart} - {step.waveEnd}:
                </strong>{" "}
                {step.description}
              </p>
            </div>
          ))}
        </details>
      </div>
    </div>
  )
}
