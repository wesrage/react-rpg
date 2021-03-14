import React from 'react'
import classnames from 'classnames'
import Overworld from './screens/Overworld'
import DialogueWindow from './screens/DialogueWindow'
import Battle from './screens/Battle'
import { gameStore } from './store/game'
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
  const { inBattle } = React.useContext(gameStore)
  const [gameState, setGameState] = React.useState(GameState.BATTLE_STARTED)

  React.useEffect(() => {
    if (inBattle && gameState.overworld) {
      setGameState(GameState.BATTLE_STARTING)
    } else if (!inBattle && gameState.battleStarted) {
      setGameState(GameState.BATTLE_ENDED)
    }
  }, [inBattle, gameState])

  function transition() {
    if (gameState.battleStarting) {
      setGameState(GameState.BATTLE_STARTED)
    } else if (!inBattle) {
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
