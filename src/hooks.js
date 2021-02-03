import React from 'react'
import { produce } from 'immer'

function getWindowSize() {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
  }
}

export function useWindowSize() {
  const [size, setSize] = React.useState(getWindowSize())
  React.useEffect(() => {
    function handleResize() {
      setSize(getWindowSize())
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return size
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

const KEYBOARD_DIRECTION_MAPPING = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
}

export function useControls() {
  const [keyStack, keyDispatch] = React.useReducer(keyStateReducer, [])
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
  }, [])
  const directionKey = keyStack.find(key => key in KEYBOARD_DIRECTION_MAPPING)
  const direction = KEYBOARD_DIRECTION_MAPPING[directionKey] || null
  return { direction }
}
