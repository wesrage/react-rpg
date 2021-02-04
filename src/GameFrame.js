import React from 'react'
import Overworld from './screens/Overworld'
import { useWindowSize, useControls } from './hooks'

const root = document.documentElement
const ASPECT_RATIO_WIDTH = Number(getComputedStyle(root).getPropertyValue('--aspect-width'))
const ASPECT_RATIO_HEIGHT = Number(getComputedStyle(root).getPropertyValue('--aspect-height'))
export const ControlsContext = React.createContext({ stack: [] })

const roomMap = {
  tiles: [
    // prettier-ignore
    'xxxxxxx',
    'x     x',
    'x     xxx',
    'x       x',
    'x      xx',
    'xxxxxxxx',
  ],
  key: {
    ' ': () => ({
      style: { background: 'orange' },
    }),
    x: () => ({
      style: { background: 'forestgreen' },
    }),
  },
}

export default function GameFrame() {
  const { height, width } = useWindowSize()
  const controls = useControls()
  const unit = Math.min(height / ASPECT_RATIO_HEIGHT, width / ASPECT_RATIO_WIDTH)
  document.documentElement.style.setProperty('--unit', `${unit}px`)
  return (
    <div id="game-frame">
      <ControlsContext.Provider value={controls}>
        <Overworld map={roomMap} />
      </ControlsContext.Provider>
    </div>
  )
}
