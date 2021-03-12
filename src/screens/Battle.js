import React from 'react'
import AnimatedSprite from '../AnimatedSprite'
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
    <div className="battle">
      <div className="battle__zone">
        <div className="battle__enemies">
          <div className="battle__enemy"></div>
        </div>
        <div className="battle__party">
          <div className="battle__party-member"></div>
        </div>
      </div>
      <div className="battle__menu"></div>
    </div>
  )
}
