import React from 'react'
import { produce } from 'immer'
import room1 from '../rooms/room1'

const initialState = {
  x: 1,
  y: 1,
  face: { x: 0, y: 1 },
  map: room1,
  moving: false,
  teleporting: false,
}
const store = React.createContext(initialState)

const MOVEMENT_DIRECTION_MAP = {
  DOWN: { y: 1 },
  UP: { y: -1 },
  LEFT: { x: -1 },
  RIGHT: { x: 1 },
}

function reducer(state, action) {
  switch (action.type) {
    case 'MOVE':
      if (state.moving && !action.continue) {
        return state
      }
      if (state.teleporting) {
        return state
      }
      const { x, y } = MOVEMENT_DIRECTION_MAP[action.direction]
      return produce(state, draft => {
        draft.moving = false
        draft.face = { x: x || 0, y: y || 0 }
        const nextX = state.x + (x || 0)
        const nextY = state.y + (y || 0)
        if (nextY >= 0 && nextY < state.map.tiles.length) {
          if (nextX >= 0 && nextX < state.map.tiles[nextY].length) {
            if (state.map.tiles[nextY][nextX] !== 'x') {
              draft.x = nextX
              draft.y = nextY
              draft.moving = true
            }
          }
        }
      })
    case 'TELEPORT':
      return produce(state, draft => {
        draft.face = action.face || draft.face
        draft.x = action.x
        draft.y = action.y
        draft.map = action.map
        draft.teleporting = true
        draft.moving = false
      })
    case 'END_MOVE':
      return produce(state, draft => {
        draft.moving = false
      })
    case 'END_TELEPORT':
      return produce(state, draft => {
        draft.teleporting = false
      })
    default:
      return state
  }
}

function LocationProvider({ children }) {
  const [location, dispatch] = React.useReducer(reducer, initialState)
  function move(direction, options) {
    dispatch({ type: 'MOVE', direction, ...options })
  }
  function teleport(newState) {
    dispatch({ type: 'TELEPORT', ...newState })
  }
  function endMove() {
    dispatch({ type: 'END_MOVE' })
  }
  function endTeleport() {
    dispatch({ type: 'END_TELEPORT' })
  }
  return (
    <store.Provider value={{ location, move, endMove, teleport, endTeleport }}>
      {children}
    </store.Provider>
  )
}

export { store as locationStore, LocationProvider }
