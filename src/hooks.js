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

export function useImageSize(image) {
  const [size, setSize] = React.useState({ width: 0, height: 0 })
  React.useEffect(() => {
    const img = new Image()
    img.onload = function () {
      setSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }
    img.src = image
  }, [image])
  return size
}

function keyStateReducer(state, action) {
  switch (action.type) {
    case 'KEY_DOWN':
      if (state.pressed.includes(action.key)) {
        return state
      }
      return produce(state, draft => {
        draft.pressed.unshift(action.key)
        draft.triggered.unshift(action.key)
      })
    case 'KEY_UP':
      return produce(state, draft => {
        draft.pressed = state.pressed.filter(key => key !== action.key)
        draft.released.unshift(action.key)
      })
    case 'KEY_UNTRIGGER':
      if (!state.triggered.length) {
        return state
      }
      return produce(state, draft => {
        draft.triggered = []
      })
    case 'KEY_UNRELEASE':
      if (!state.released.length) {
        return state
      }
      return produce(state, draft => {
        draft.released = []
      })
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

const BUTTON_MAPPING = {
  ' ': 'CONFIRM',
}

export function useControls() {
  const [keyState, keyDispatch] = React.useReducer(keyStateReducer, {
    pressed: [],
    triggered: [],
    released: [],
  })
  React.useEffect(() => {
    keyDispatch({ type: 'KEY_UNTRIGGER' })
  }, [keyState.triggered])
  React.useEffect(() => {
    keyDispatch({ type: 'KEY_UNRELEASE' })
  }, [keyState.released])
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
  const directionKey = keyState.pressed.find(key => key in KEYBOARD_DIRECTION_MAPPING)
  const direction = KEYBOARD_DIRECTION_MAPPING[directionKey] || null
  const confirm = !!keyState.triggered.find(key => BUTTON_MAPPING[key] === 'CONFIRM')
  return { direction, confirm }
}

export function useTick(fps, onTick, autoStart = false) {
  const callbackRef = React.useRef(onTick)
  const frameRef = React.useRef()
  const then = React.useRef(0)
  const fpsInterval = React.useRef(1000 / fps)
  const stopped = React.useRef(!autoStart)

  React.useLayoutEffect(() => {
    callbackRef.current = onTick
    cancelAnimationFrame(frameRef.current)
  }, [onTick, fps])

  React.useLayoutEffect(() => {
    fpsInterval.current = 1000 / fps
  }, [fps])

  const loop = React.useCallback((timestamp) => {
    if (stopped.current) {
      cancelAnimationFrame(frameRef.current)
      return
    }
    const elapsed = timestamp - then.current
    if (elapsed > fpsInterval.current) {
      then.current = timestamp - (elapsed % fpsInterval.current)
      callbackRef.current()
    }
    frameRef.current = requestAnimationFrame(loop)
  }, [])

  React.useLayoutEffect(() => {
    frameRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frameRef.current)
    }
  }, [loop])

  const stop = React.useCallback(() => {
    stopped.current = true
  }, [])

  const start = React.useCallback(() => {
    stopped.current = false
    loop()
  }, [loop])

  return [start, stop]
}

