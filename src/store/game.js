import React from 'react'

const initialState = {}
const store = React.createContext(initialState)

function reducer(state, action) {
  return state
}

function GameStateProvider({ children }) {
  const [gameState, dispatch] = React.useReducer(reducer, initialState)
  return <store.Provider value={gameState}>{children}</store.Provider>
}

export { store as gameStateStore, GameStateProvider }
