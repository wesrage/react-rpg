import React from 'react'
import Overworld from './screens/Overworld'
import DialogueWindow from './screens/DialogueWindow'
import { GameStateProvider } from './store/game'
import { ControlsProvider } from './store/controls'
import { LocationProvider } from './store/location'
import { CharactersProvider } from './store/characters'
import { InventoryProvider } from './store/inventory'
import { DialogueProvider } from './store/dialogue'
import { useWindowSize } from './hooks'

const root = document.documentElement
const ASPECT_RATIO_WIDTH = Number(getComputedStyle(root).getPropertyValue('--aspect-width'))
const ASPECT_RATIO_HEIGHT = Number(getComputedStyle(root).getPropertyValue('--aspect-height'))

export default function GameFrame() {
  const { height, width } = useWindowSize()
  const unit = Math.min(height / ASPECT_RATIO_HEIGHT, width / ASPECT_RATIO_WIDTH)
  document.documentElement.style.setProperty('--unit', `${unit}px`)
  return (
    <div id="game-frame">
      <GameStateProvider>
        <ControlsProvider>
          <LocationProvider>
            <CharactersProvider>
              <InventoryProvider>
                <DialogueProvider>
                  <Overworld />
                  <DialogueWindow />
                </DialogueProvider>
              </InventoryProvider>
            </CharactersProvider>
          </LocationProvider>
        </ControlsProvider>
      </GameStateProvider>
    </div>
  )
}
