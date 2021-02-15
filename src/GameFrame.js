import React from 'react'
import Overworld from './screens/Overworld'
import { useWindowSize, useControls } from './hooks'
import roomMap from './rooms/room1'

const root = document.documentElement
const ASPECT_RATIO_WIDTH = Number(getComputedStyle(root).getPropertyValue('--aspect-width'))
const ASPECT_RATIO_HEIGHT = Number(getComputedStyle(root).getPropertyValue('--aspect-height'))
export const ControlsContext = React.createContext({ stack: [] })

const initialPosition = {
  x: 1,
  y: 1,
  face: { x: 0, y: 1 },
  moving: false,
}

export default function GameFrame() {
  const { height, width } = useWindowSize()
  const controls = useControls()
  const unit = Math.min(height / ASPECT_RATIO_HEIGHT, width / ASPECT_RATIO_WIDTH)
  document.documentElement.style.setProperty('--unit', `${unit}px`)
  return (
    <div id="game-frame">
      <ControlsContext.Provider value={controls}>
        <Overworld />
      </ControlsContext.Provider>
    </div>
  )
}
