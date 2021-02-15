import React from 'react'

const initialState = {
  items: {},
  money: 0,
}
const store = React.createContext(initialState)

function reducer(state, action) {
  return state
}

function InventoryProvider({ children }) {
  const [inventory, dispatch] = React.useReducer(reducer, initialState)
  return <store.Provider value={inventory}>{children}</store.Provider>
}

export { store as inventoryStore, InventoryProvider }
