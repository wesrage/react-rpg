import React from 'react'
import classnames from 'classnames'
import { dialogueStore } from '../store/dialogue'
import { controlsStore } from '../store/controls'
import { useTick } from '../hooks'

class DialogueWindowState {
  static CLOSED = new DialogueWindowState('CLOSED')
  static OPENING = new DialogueWindowState('OPENING')
  static CLOSING = new DialogueWindowState('CLOSING')
  static TYPING = new DialogueWindowState('TYPING')
  static WAITING = new DialogueWindowState('WAITING')

  constructor(state = 'CLOSED') {
    this.state = state
    this.closed = this.state === 'CLOSED'
    this.opening = this.state === 'OPENING'
    this.typing = this.state === 'TYPING'
    this.waiting = this.state === 'WAITING'
    this.open = this.typing || this.waiting
    this.closing = this.state === 'CLOSING'
  }
}

export default function DialogueWindow() {
  const { current, enableInput, disableInput } = React.useContext(dialogueStore)
  const { confirm } = React.useContext(controlsStore)
  const [state, setState] = React.useState(DialogueWindowState.CLOSED)
  const [displayText, setDisplayText] = React.useState('')

  // Add the next character to the end of the displayed text
  const printNext = React.useCallback(() => {
    if (!current || !state.typing) {
      return
    }
    setDisplayText(d => current.slice(0, d.length + 1))
  }, [current, state.typing])

  // Skip ahead to display entire message
  React.useEffect(() => {
    if (state.typing && confirm) {
      setDisplayText(current)
    }
  }, [current, state.typing, confirm])

  // Print each character one at a time on a regular interval
  const [start, stop] = useTick(30, printNext)

  // The current message has changed, so reset
  React.useEffect(() => {
    if (current) {
      setState(DialogueWindowState.TYPING)
    }
  }, [current])

  // Start or stop printing more characters depending on typing state
  React.useEffect(() => {
    if (state.typing) {
      setDisplayText('')
      start()
    } else {
      stop()
    }
  }, [start, stop, state.typing])

  // If the whole message is displayed, wait for user input
  React.useEffect(() => {
    if (displayText === current) {
      setState(DialogueWindowState.WAITING)
    }
  }, [displayText, current, stop])

  // Transition to next state
  React.useEffect(() => {
    if (current && state.closed) {
      setState(DialogueWindowState.OPENING)
    } else if (!current && state.open) {
      setState(DialogueWindowState.CLOSING)
    }
  }, [state, current])

  // Enable or disable advancing dialogue
  React.useEffect(() => {
    if (state.closing || state.typing) {
      disableInput()
    } else if (state.waiting || (state.closed && !current)) {
      enableInput()
    }
  }, [state, current, disableInput, enableInput])

  // Clean up display message before closing the window
  React.useEffect(() => {
    if (state.closing) {
      setDisplayText('')
    }
  }, [state.closing])

  function handleTransitionEnd() {
    if (state.closing) {
      setState(DialogueWindowState.CLOSED)
    } else if (state.opening) {
      setState(DialogueWindowState.TYPING)
    }
  }

  return (
    <div
      className={classnames('dialogue-window', {
        'dialogue-window--closed': !state.open && !state.opening,
      })}
      onTransitionEnd={handleTransitionEnd}
    >
      {state.open && <span>{displayText}</span>}
    </div>
  )
}
