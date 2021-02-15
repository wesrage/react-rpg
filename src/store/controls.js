import React from 'react'
import { useControls } from '../hooks'

const initialControlsState = { stack: [] }
const store = React.createContext(initialControlsState)

function ControlsProvider({ children }) {
  const controls = useControls()
  return <store.Provider value={controls}>{children}</store.Provider>
}

export { store as controlsStore, ControlsProvider }
