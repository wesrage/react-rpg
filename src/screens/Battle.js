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
    <div style={{ height: '100%', width: '100%', background: '#000', color: '#fff' }}>
      <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Battle!</h1>
      <h4 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Press [CONFIRM] to win</h4>
    </div>
  )
}
