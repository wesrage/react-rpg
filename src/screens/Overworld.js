import React from 'react'
import { produce } from 'immer'

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

function keyStateReducer(state, action) {
  switch (action.type) {
    case 'KEY_DOWN':
      if (state.includes(action.key)) {
        return state
      }
      return produce(state, draft => {
        draft.unshift(action.key)
      })
    case 'KEY_UP':
      return state.filter(key => key !== action.key)
    default:
      return state
  }
}

const MOVEMENT_KEY_MAP = {
  ArrowDown: { y: -1 },
  ArrowUp: { y: 1 },
  ArrowLeft: { x: 1 },
  ArrowRight: { x: -1 },
}

export default function Overworld() {
  const [position, positionDispatch] = React.useReducer(positionReducer, initialPosition)
  const [keyState, keyDispatch] = React.useReducer(keyStateReducer, [])

  React.useEffect(() => {
    function handleKeydown(e) {
      keyDispatch({ type: 'KEY_DOWN', key: e.key })
    }
    function handleKeyup(e) {
      keyDispatch({ type: 'KEY_UP', key: e.key })
    }
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyup)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyup)
    }
  }, [keyDispatch])

  React.useEffect(() => {
    const key = keyState[0]
    if (key in MOVEMENT_KEY_MAP) {
      positionDispatch({ type: 'MOVE', ...MOVEMENT_KEY_MAP[key] })
    }
  }, [keyState, positionDispatch])

  const handleTransitionEnd = React.useCallback(() => {
    const key = keyState[0]
    if (key in MOVEMENT_KEY_MAP) {
      positionDispatch({ type: 'MOVE', continuous: true, ...MOVEMENT_KEY_MAP[key] })
    } else {
      positionDispatch({ type: 'STOP_MOVING' })
    }
  }, [keyState])

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
