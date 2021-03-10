import React from 'react'
import Overworld from './screens/Overworld'
import DialogueWindow from './screens/DialogueWindow'
import Battle from './screens/Battle'
import { battleStore } from './store/battle'

export default function GameManager() {
  const { active: battleActive } = React.useContext(battleStore)
  return battleActive ? (
    <Battle />
  ) : (
    <>
      <Overworld />
      <DialogueWindow />
    </>
  )
}
