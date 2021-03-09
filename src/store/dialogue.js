import React from 'react'
import { produce } from 'immer'

const initialState = {
  inputEnabled: true,
}
const store = React.createContext(initialState)

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN':
      if (!state.inputEnabled) {
        return state
      }
      return {
        current: action.sentences[0],
        queue: action.sentences.slice(1),
      }
    case 'ADVANCE':
      if (!state.inputEnabled) {
        return state
      }
      if (!state.queue.length) {
        return {
          current: null,
          queue: [],
        }
      }
      return {
        current: state.queue[0],
        queue: state.queue.slice(1),
      }
    case 'ENABLE_INPUT':
      return produce(state, draft => {
        draft.inputEnabled = true
      })
    case 'DISABLE_INPUT':
      return produce(state, draft => {
        draft.inputEnabled = false
      })
    default:
      return state
  }
}

function DialogueProvider({ children }) {
  const [dialogueState, dispatch] = React.useReducer(reducer, initialState)
  const openDialogue = React.useCallback((sentences) => {
    dispatch({ type: 'OPEN', sentences })
  }, [])
  const advanceDialogue = React.useCallback(() => {
    dispatch({ type: 'ADVANCE' })
  }, [])
  return (
    <store.Provider
      value={{
        openDialogue,
        advanceDialogue,
        current: dialogueState.current,
        enableInput: () => dispatch({ type: 'ENABLE_INPUT' }),
        disableInput: () => dispatch({ type: 'DISABLE_INPUT' }),
      }}
    >
      {children}
    </store.Provider>
  )
}

export { store as dialogueStore, DialogueProvider }
