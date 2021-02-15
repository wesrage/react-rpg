import React from 'react'
import { produce } from 'immer'
import { ControlsContext } from '../GameFrame'
import AnimatedSprite from '../AnimatedSprite'
import Tile from '../Tile'
import '../cecil.overworld.css'
import room1Map from '../rooms/room1'

const initialPosition = {
  x: 1,
  y: 1,
  face: { x: 0, y: 1 },
  moving: false,
  map: room1Map,
  teleporting: false,
}

const MOVEMENT_DIRECTION_MAP = {
  DOWN: { y: 1 },
  UP: { y: -1 },
  LEFT: { x: -1 },
  RIGHT: { x: 1 },
}

function positionReducer(state, action) {
  switch (action.type) {
    case 'MOVE':
      if (state.moving && !action.continuous) {
        return state
      }
      if (state.teleporting) {
        return state
      }
      const { x, y } = MOVEMENT_DIRECTION_MAP[action.direction]
      return produce(state, draft => {
        draft.moving = false
        draft.face = { x: x || 0, y: y || 0 }
        const nextX = state.x + (x || 0)
        const nextY = state.y + (y || 0)
        if (nextY >= 0 && nextY < state.map.tiles.length) {
          if (nextX >= 0 && nextX < state.map.tiles[nextY].length) {
            if (state.map.tiles[nextY][nextX] !== 'x') {
              draft.x = nextX
              draft.y = nextY
              draft.moving = true
            }
          }
        }
      })
    case 'TELEPORT':
      return produce(state, draft => {
        draft.face = action.face || draft.face
        draft.x = action.x
        draft.y = action.y
        draft.map = action.map
        draft.teleporting = true
        draft.moving = false
      })
    case 'STOP_MOVING':
      return produce(state, draft => {
        draft.moving = false
      })
    case 'STOP_TELEPORTING':
      return produce(state, draft => {
        draft.teleporting = false
      })
    default:
      return state
  }
}

function getAnimationState(position) {
  if (position.face.x > 0) {
    return position.moving ? 'cecil-walk-right' : 'cecil-idle-right'
  }
  if (position.face.x < 0) {
    return position.moving ? 'cecil-walk-left' : 'cecil-idle-left'
  }
  if (position.face.y < 0) {
    return position.moving ? 'cecil-walk-up' : 'cecil-idle-up'
  }
  if (position.face.y > 0) {
    return position.moving ? 'cecil-walk-down' : 'cecil-idle-down'
  }
}

export default function Overworld() {
  const [position, positionDispatch] = React.useReducer(positionReducer, initialPosition)
  const controls = React.useContext(ControlsContext)

  React.useEffect(() => {
    if (controls.direction) {
      positionDispatch({ type: 'MOVE', direction: controls.direction })
    }
  }, [controls.direction])

  const handleTransitionEnd = React.useCallback(() => {
    const mapChar = position.map.tiles[position.y][position.x]
    if (position.moving && position.map.key[mapChar].onStep) {
      positionDispatch({
        ...position.map.key[mapChar].onStep(),
        moving: false,
      })
    } else if (position.teleporting) {
      positionDispatch({ type: 'STOP_TELEPORTING' })
    } else if (controls.direction) {
      positionDispatch({
        type: 'MOVE',
        continuous: true,
        direction: controls.direction,
      })
    } else {
      positionDispatch({ type: 'STOP_MOVING' })
    }
  }, [controls.direction, position.map, position.teleporting, position.moving, position.x, position.y])

  return (
    <>
      <div
        onTransitionEnd={handleTransitionEnd}
        className="overworld"
        style={{
          left: `calc((((var(--aspect-width) - 1) / 2) - ${position.x}) * var(--unit))`,
          top: `calc((((var(--aspect-height) - 1) / 2) - ${position.y}) * var(--unit))`,
        }}
      >
        {position.map.tiles.map((row, rowIndex) => (
          <div className="tile-row" key={rowIndex}>
            {row.split('').map((item, tileIndex) => {
              return <Tile key={tileIndex} {...position.map.key[item]} />
            })}
          </div>
        ))}
      </div>
      <AnimatedSprite cssClass="cecil-sprite" animationState={getAnimationState(position)} />
    </>
  )
}
