import React from 'react'
import { produce } from 'immer'
import { ControlsContext } from '../GameFrame'

const initialPosition = {
  x: 0,
  y: 0,
  face: { x: 0, y: 1 },
  moving: false,
}

const MOVEMENT_DIRECTION_MAP = {
  DOWN: { y: -1 },
  UP: { y: 1 },
  LEFT: { x: 1 },
  RIGHT: { x: -1 },
}

function positionReducer(state, action) {
  switch (action.type) {
    case 'MOVE':
      if (state.moving && !action.continuous) {
        return state
      }
      const { x, y } = MOVEMENT_DIRECTION_MAP[action.direction]
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

export default function Overworld() {
  const [position, positionDispatch] = React.useReducer(positionReducer, initialPosition)
  const controls = React.useContext(ControlsContext)

  React.useEffect(() => {
    if (controls.direction) {
      positionDispatch({ type: 'MOVE', direction: controls.direction })
    }
  }, [controls.direction])

  const handleTransitionEnd = React.useCallback(() => {
    if (controls.direction) {
      positionDispatch({
        type: 'MOVE',
        continuous: true,
        direction: controls.direction,
      })
    } else {
      positionDispatch({ type: 'STOP_MOVING' })
    }
  }, [controls.direction])

  const faceAngle =
    position.face.x < 0 ? 90 : position.face.y < 0 ? 180 : position.face.x > 0 ? 270 : 0

  return (
    <>
      <div
        onTransitionEnd={handleTransitionEnd}
        style={{
          height: 'calc(64 * var(--unit))',
          width: 'calc(64 * var(--unit))',
          backgroundColor: 'orange',
          backgroundSize: 'var(--unit) var(--unit)',
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.5) 2px, transparent 2px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.5) 2px, transparent 2px)
          `,
          position: 'absolute',
          left: `calc(${position.x} * var(--unit))`,
          top: `calc(${position.y} * var(--unit))`,
          transition: 'top 0.25s linear, left 0.25s linear',
        }}
      />
      <div
        style={{
          background: 'magenta',
          height: 'var(--unit)',
          width: 'var(--unit)',
          position: 'absolute',
          borderTop: '2px solid #000',
          transform: `rotate(${faceAngle}deg)`,
          top: 'calc((var(--aspect-height) - 1) / 2 * var(--unit))',
          left: 'calc((var(--aspect-width) - 1) / 2 * var(--unit))',
        }}
      />
    </>
  )
}
