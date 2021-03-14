import React from 'react'
import classnames from 'classnames'
import produce from 'immer'
import { controlsStore } from '../store/controls'
import { gameStore } from '../store/game'
import { charactersStore } from '../store/characters'

// STATES:
//  - loading in participants
//      LOOP:
//  - awaiting input
//      - need to calculate whose turn it is
//      - right now characters and enemies are in different stores, which is inconvenient
//      - but this can be done in a pure function that takes all entities in a single argument
//  - animate action start if needed (e.g. protagonist steps forward)
//  - displaying animation (sub-states owned by action)
//      - could (and should) every command/spell/etc. have its own component?
//  - show result (damage numbers, etc.)
//  - animate death or status effect if applicable (e.g. enemy dissolves away)
//  - animate back if needed (e.g. protagonist steps back)
//  - commit battle-scoped changes to state
//  - commit permanent changes to characterStore
//      /LOOP
//  - end of battle display
//  - transition out

const Phase = {
  SETUP: 'SETUP',
  TRANSITIONING_IN: 'TRANSITIONING_IN',
  AWAITING_INPUT: 'AWAITING_INPUT',
  TAKING_ACTION: 'TAKING_ACTION',
  DISPLAYING_RESULTS: 'DISPLAYING_RESULTS',
  TRANSITIONING_OUT: 'TRANSITIONING_OUT',
  TEARDOWN: 'TEARDOWN',
}

const initialState = {
  phase: Phase.SETUP,
  active: null,
  enemies: [
    {
      id: 'guard1',
      name: 'Guard',
      hp: 60,
      maxHp: 60,
      mp: 10,
      maxMp: 10,
      physicalPower: 3,
      physicalDefense: 4,
      magicPower: 2,
      magicDefense: 2,
      speed: 3,
      charge: 0,
    },
  ],
}

const FULL_CHARGE = 100

function isDead(enemy) {
  // TODO: Can be expanded
  return enemy.hp <= 0
}

export default function Battle() {
  const characters = React.useContext(charactersStore)
  const [state, setState] = React.useState({
    ...initialState,
    characters: characters.map((character) => ({
      ...character,
      charge: 0,
    })),
  })
  const { inBattle, winBattle, loseBattle } = React.useContext(gameStore)
  const { confirm } = React.useContext(controlsStore)

  function advanceTurns(characters, enemies) {
    const entities = [...characters, ...enemies]
    const turnsToAdvance = Math.min(
      ...entities.map(({ speed, charge }) => (FULL_CHARGE - charge) / speed),
    )
    const newCharacters = characters.map((c) => ({
      ...c,
      charge: Math.floor(c.charge + turnsToAdvance * c.speed),
    }))
    const newEnemies = enemies.map((e) => ({
      ...e,
      charge: Math.floor(e.charge + turnsToAdvance * e.speed),
    }))
    const activeEntity =
      newCharacters.find((c) => c.charge >= 100) || newEnemies.find((c) => c.charge >= 100)
    setState({
      phase: Phase.AWAITING_INPUT,
      active: activeEntity.id,
      characters: newCharacters,
      enemies: newEnemies,
    })
  }

  const act = React.useCallback(() => {
    // TODO: Handle damage, status changes, death, etc.
    if (state.phase === Phase.AWAITING_INPUT) {
      setState((s) =>
        produce(s, (draft) => {
          const actor = [...draft.characters, ...draft.enemies].find((e) => e.id === s.active)
          actor.charge = 0
          draft.phase = Phase.TAKING_ACTION
        }),
      )
    }
  }, [state.phase])

  React.useEffect(() => {
    if (confirm) {
      act()
    }
  }, [act, confirm])

  // Check for battle end
  React.useEffect(() => {
    if (state.enemies.every(isDead)) {
      winBattle()
    } else if (state.characters.every(isDead)) {
      loseBattle()
    }
  }, [state.enemies, winBattle, state.characters, loseBattle])

  // Transition to next state to start transitioning in animation
  React.useEffect(() => {
    if (state.phase === Phase.SETUP) {
      setState((s) => ({
        ...s,
        phase: Phase.TRANSITIONING_IN,
      }))
    }
  }, [state.phase])

  function transition() {
    if (state.phase === Phase.TRANSITIONING_IN) {
      advanceTurns(state.characters, state.enemies)
    } else if (state.phase === Phase.TAKING_ACTION) {
      advanceTurns(state.characters, state.enemies)
    }
  }

  // Debugging
  React.useEffect(() => {
    console.log(state.phase, state.active)
  }, [state.phase, state.active])

  React.useEffect(() => {
    const entities = [...state.characters, ...state.enemies]
    entities.forEach((entity) => {
      console.log(entity.name, entity.charge)
    })
  }, [state.active, state.characters, state.enemies])

  if (!inBattle) {
    return null
  }

  return (
    <div className="battle">
      <div className="battle__zone">
        <div
          className={classnames('battle__enemies', {
            'battle__enemies--entering': state.phase === Phase.SETUP,
          })}
          onTransitionEnd={transition}
        >
          {state.enemies.map((enemy) => (
            <div
              key={enemy.id}
              className={classnames('battle__enemy', {
                'battle__enemy--acting':
                  state.active === enemy.id && state.phase === Phase.TAKING_ACTION,
              })}
              onAnimationEnd={transition}
            >
              <div>{enemy.name}</div>
              <div>
                {enemy.hp} / {enemy.maxHp}
              </div>
            </div>
          ))}
        </div>
        <div
          className={classnames('battle__party', {
            'battle__party--entering': state.phase === Phase.SETUP,
          })}
          onTransitionEnd={transition}
        >
          {state.characters.map((character) => (
            <div
              key={character.id}
              className={classnames('battle__party-member', {
                'battle__party-member--acting':
                  state.active === character.id && state.phase === Phase.TAKING_ACTION,
              })}
              onAnimationEnd={transition}
            >
              <div>{character.name}</div>
              <div>
                {character.hp} / {character.maxHp}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="battle__menu"></div>
    </div>
  )
}
