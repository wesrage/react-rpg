import React from 'react'
import { dialogueStore } from '../store/dialogue'

export default function DialogueWindow() {
  const { current } = React.useContext(dialogueStore)
  if (!current) {
    return null
  }
  return (
    <div className="dialogue-window">
      <span>{current}</span>
    </div>
  )
}
