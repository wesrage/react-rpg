import React from 'react'
import { produce } from 'immer'
import room1 from '../rooms/room1'
import room2 from '../rooms/room2'

export const MoveState = {
  IDLE: 0,
  MOVING: 1,
  TELEPORTING_IN: 2,
  TELEPORTING_OUT: 3,
}

const initialState = {
  // x: 1,
  // y: 1,
  // face: { x: 0, y: 1 },
  // map: room1,
  x: 8,
  y: 2,
  face: {x: 1, y: 0},
  map: room2,
  moveState: MoveState.IDLE,
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
      if (state.moveState === MoveState.TELEPORTING_IN || state.moveState === MoveState.TELEPORTING_OUT) {
        return state
      }
      if (state.moveState === MoveState.MOVING && !action.continue) {
        return state
      }
      const { x, y } = MOVEMENT_DIRECTION_MAP[action.direction]
      return produce(state, draft => {
        draft.moveState = MoveState.IDLE
        draft.face = { x: x || 0, y: y || 0 }
        const nextX = state.x + (x || 0)
        const nextY = state.y + (y || 0)
        if (nextY >= 0 && nextY < state.map.tiles.length) {
          if (nextX >= 0 && nextX < state.map.tiles[nextY].length) {
            const tileChar = state.map.tiles[nextY][nextX]
            if (state.map.key[tileChar].walkable) {
              draft.x = nextX
              draft.y = nextY
              draft.moveState = MoveState.MOVING
            }
          }
        }
      })
    case 'TELEPORT':
      return produce(state, draft => {
        draft.next = {
          face: action.face || draft.face,
          x: action.x,
          y: action.y,
          map: action.map,
        }
        draft.moveState = MoveState.TELEPORTING_IN
      })
    case 'END_MOVE':
      return produce(state, draft => {
        draft.moveState = MoveState.IDLE
      })
    case 'TELEPORT_OUT':
      return {
        ...state,
        ...state.next,
        moveState: MoveState.TELEPORTING_OUT,
      }
    case 'END_TELEPORT':
      return produce(state, draft => {
        draft.moveState = MoveState.IDLE
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
  function teleportOut() {
    dispatch({ type: 'TELEPORT_OUT' })
  }
  function endTeleport() {
    dispatch({ type: 'END_TELEPORT' })
  }
  return (
    <store.Provider value={{ location, move, endMove, teleport, teleportOut, endTeleport }}>
      {children}
    </store.Provider>
  )
}

export { store as locationStore, LocationProvider }
