import React from 'react'

const initialState = {
  inBattle: true,
}
const store = React.createContext(initialState)

function reducer(state, action) {
  switch (action.type) {
    case 'START_BATTLE':
      return {
        inBattle: true,
      }
    case 'END_BATTLE':
      return {
        inBattle: false,
      }
    default:
      return state
  }
}

function GameStateProvider({ children }) {
  const [gameState, dispatch] = React.useReducer(reducer, initialState)
  const startBattle = React.useCallback(() => {
    dispatch({ type: 'START_BATTLE' })
  }, [])
  const winBattle = React.useCallback(() => {
    dispatch({ type: 'END_BATTLE' })
  }, [])
  const loseBattle = React.useCallback(() => {
    dispatch({ type: 'END_BATTLE' })
  }, [])
  return (
    <store.Provider
      value={{
        inBattle: gameState.inBattle,
        startBattle,
        winBattle,
        loseBattle,
      }}
    >
      {children}
    </store.Provider>
  )
}

export { store as gameStore, GameStateProvider }
