import React from 'react'

const initialState = {}
const store = React.createContext(initialState)

function reducer(state, action) {
  return state
}

function CharactersProvider({ children }) {
  const [characters, dispatch] = React.useReducer(reducer, initialState)
  return <store.Provider value={characters}>{children}</store.Provider>
}

export { store as charactersStore, CharactersProvider }
