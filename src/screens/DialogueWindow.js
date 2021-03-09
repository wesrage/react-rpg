import React from 'react'
import classnames from 'classnames'
import { dialogueStore } from '../store/dialogue'

const DialogueWindowState = {
  CLOSED: 'CLOSED',
  OPENING: 'OPENING',
  OPEN: 'OPEN',
  CLOSING: 'CLOSING',
}

export default function DialogueWindow() {
  const { current, enableInput, disableInput } = React.useContext(dialogueStore)
  const [state, setState] = React.useState(DialogueWindowState.CLOSED)
  React.useEffect(() => {
    if (current && state === DialogueWindowState.CLOSED) {
      setState(DialogueWindowState.OPENING)
    } else if (!current && state === DialogueWindowState.OPEN) {
      disableInput()
      setState(DialogueWindowState.CLOSING)
    } else if (state === DialogueWindowState.OPEN) {
      enableInput()
    } else if (!current && state === DialogueWindowState.CLOSED) {
      enableInput()
    }
  }, [current, state, enableInput, disableInput])
  function handleTransitionEnd() {
    if (state === DialogueWindowState.CLOSING) {
      setState(DialogueWindowState.CLOSED)
    } else if (state === DialogueWindowState.OPENING) {
      setState(DialogueWindowState.OPEN)
    }
  }
  let transitionClassModifier = 'closed'
  if (state === DialogueWindowState.OPEN || state === DialogueWindowState.OPENING) {
    transitionClassModifier = 'open'
  }
  return (
    <div
      className={classnames('dialogue-window', `dialogue-window--${transitionClassModifier}`)}
      onTransitionEnd={handleTransitionEnd}
    >
      {state === DialogueWindowState.OPEN && (
        <span>{current}</span>
      )}
    </div>
  )
}
