import React from 'react'
import { produce } from 'immer'

const initialState = {}
const store = React.createContext(initialState)

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN':
      return {
        current: action.sentences[0],
        queue: action.sentences.slice(1),
      }
    case 'ADVANCE':
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
    default:
      return state
  }
}

function DialogueProvider({ children }) {
  const [dialogueState, dispatch] = React.useReducer(reducer, initialState)
  const openDialogue = React.useCallback(sentences => {
    dispatch({ type: 'OPEN', sentences })
  }, [])
  const advanceDialogue = React.useCallback(() => {
    dispatch({ type: 'ADVANCE' })
  }, [])
  return (
    <store.Provider value={{ openDialogue, advanceDialogue, current: dialogueState.current }}>
      {children}
    </store.Provider>
  )
}

export { store as dialogueStore, DialogueProvider }
