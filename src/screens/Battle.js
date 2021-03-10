import React from 'react'
import { controlsStore } from '../store/controls'
import { battleStore } from '../store/battle'

export default function DialogueWindow() {
  const { active, winBattle } = React.useContext(battleStore)
  const { confirm } = React.useContext(controlsStore)

  React.useEffect(() => {
    if (confirm) {
      winBattle()
    }
  }, [winBattle, confirm])

  if (!active) {
    return null
  }

  return (
    <div style={{ height: '100%', width: '100%', background: 'forestgreen' }}>
      <h1 style={{ margin: 0 }}>Battle!</h1>
      <h2>Press [CONFIRM] to win</h2>
    </div>
  )
}
