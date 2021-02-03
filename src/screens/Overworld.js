import React from 'react'
import { produce } from 'immer'
import { ControlsContext } from '../GameFrame'

const initialPosition = {
  x: 0,
  y: 0,
  face: { x: 0, y: 1 },
  moving: false,
}

function positionReducer(state, action) {
  switch (action.type) {
    case 'MOVE':
      if (state.moving && !action.continuous) {
        return state
      }
      const { x, y } = action
      return produce(state, draft => {
        draft.x += x || 0
        draft.y += y || 0
        draft.face = { x: x || 0, y: y || 0 }
        draft.moving = true
      })
    case 'STOP_MOVING': {
      return produce(state, draft => {
        draft.moving = false
      })
    }
    default:
      return state
  }
}

const MOVEMENT_DIRECTION_MAP = {
  DOWN: { y: -1 },
  UP: { y: 1 },
  LEFT: { x: 1 },
  RIGHT: { x: -1 },
}

export default function Overworld() {
  const [position, positionDispatch] = React.useReducer(positionReducer, initialPosition)
  const controls = React.useContext(ControlsContext)

  React.useEffect(() => {
    if (controls.direction in MOVEMENT_DIRECTION_MAP) {
      positionDispatch({ type: 'MOVE', ...MOVEMENT_DIRECTION_MAP[controls.direction] })
    }
  }, [controls.direction, positionDispatch])

  const handleTransitionEnd = React.useCallback(() => {
    if (controls.direction in MOVEMENT_DIRECTION_MAP) {
      positionDispatch({
        type: 'MOVE',
        continuous: true,
        ...MOVEMENT_DIRECTION_MAP[controls.direction],
      })
    } else {
      positionDispatch({ type: 'STOP_MOVING' })
    }
  }, [controls.direction])

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      style={{
        height: 'calc(64 * var(--unit))',
        width: 'calc(64 * var(--unit))',
        background: 'blue',
        position: 'absolute',
        left: `calc(${position.x} * var(--unit))`,
        top: `calc(${position.y} * var(--unit))`,
        transition: 'top 0.25s linear, left 0.25s linear',
      }}
    ></div>
  )
}
