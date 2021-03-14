import React from 'react'

const initialState = [
  {
    id: 'cecil',
    name: 'Cecil',
    hp: 100,
    maxHp: 100,
    mp: 20,
    maxMp: 20,
    physicalPower: 5,
    magicPower: 5,
    physicalDefense: 7,
    magicDefense: 3,
    speed: 4,
  },
]
const store = React.createContext(initialState)

function reducer(state, action) {
  return state
}

function CharactersProvider({ children }) {
  const [characters, dispatch] = React.useReducer(reducer, initialState)
  return <store.Provider value={characters}>{children}</store.Provider>
}

export { store as charactersStore, CharactersProvider }
