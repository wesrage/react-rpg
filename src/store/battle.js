import React from 'react'

const initialState = {
  active: false,
}
const store = React.createContext(initialState)

function reducer(state, action) {
  switch (action.type) {
    case 'START_BATTLE':
      return {
        active: true,
      }
    case 'END_BATTLE':
      return {
        active: false,
      }
    default:
      return state
  }
}

function BattleProvider({ children }) {
  const [battleState, dispatch] = React.useReducer(reducer, initialState)
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
        active: battleState.active,
        startBattle,
        winBattle,
        loseBattle,
      }}
    >
      {children}
    </store.Provider>
  )
}

export { store as battleStore, BattleProvider }
