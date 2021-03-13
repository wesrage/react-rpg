import React from 'react'
import classnames from 'classnames'
import Overworld from './screens/Overworld'
import DialogueWindow from './screens/DialogueWindow'
import Battle from './screens/Battle'
import { battleStore } from './store/battle'
import './battle.css'

class GameState {
  static OVERWORLD = new GameState('OVERWORLD')
  static BATTLE_STARTING = new GameState('BATTLE_STARTING')
  static BATTLE_STARTED = new GameState('BATTLE_STARTED')
  static BATTLE_ENDED = new GameState('BATTLE_ENDED')

  constructor(state = 'OVERWORLD') {
    this.state = state
    this.overworld = this.state === 'OVERWORLD'
    this.battleStarting = this.state === 'BATTLE_STARTING'
    this.battleStarted = this.state === 'BATTLE_STARTED'
    this.battleEnded = this.state === 'BATTLE_ENDED'
  }
}

export default function GameManager() {
  const { active: battleActive } = React.useContext(battleStore)
  const [gameState, setGameState] = React.useState(GameState.OVERWORLD)

  React.useEffect(() => {
    if (battleActive && gameState.overworld) {
      setGameState(GameState.BATTLE_STARTING)
    } else if (!battleActive && gameState.battleStarted) {
      setGameState(GameState.BATTLE_ENDED)
    }
  }, [battleActive, gameState])

  function transition() {
    if (gameState.battleStarting) {
      setGameState(GameState.BATTLE_STARTED)
    } else if (!battleActive) {
      setGameState(GameState.OVERWORLD)
    }
  }

  return (
    <>
      <div
        className={classnames({
          'entering-battle': gameState.battleStarting,
          'in-battle': gameState.battleStarted,
          'exiting-battle': gameState.battleEnded,
        })}
        onAnimationEnd={transition}
        onTransitionEnd={transition}
      >
        {!gameState.BATTLE_STARTED && (
          <>
            <Overworld controlsEnabled={gameState.overworld} />
            <DialogueWindow />
          </>
        )}
      </div>
      {gameState.battleStarted && <Battle />}
    </>
  )
}
