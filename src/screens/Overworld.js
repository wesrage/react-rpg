import React from 'react'
import { produce } from 'immer'
import { ControlsContext } from '../GameFrame'
import AnimatedSprite from '../AnimatedSprite'
import '../cecil.overworld.css'

const initialPosition = {
  x: 1,
  y: 1,
  face: { x: 0, y: 1 },
  moving: false,
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
      const { x, y } = MOVEMENT_DIRECTION_MAP[action.direction]
      return produce(state, draft => {
        draft.moving = false
        draft.face = { x: x || 0, y: y || 0 }
        const nextX = state.x + (x || 0)
        const nextY = state.y + (y || 0)
        if (nextY >= 0 && nextY < action.tiles.length) {
          if (nextX >= 0 && nextX < action.tiles[nextY].length) {
            if (action.tiles[nextY][nextX] === ' ') {
              draft.x = nextX
              draft.y = nextY
              draft.moving = true
            }
          }
        }
      })
    case 'STOP_MOVING': {
      return produce(state, draft => {
        draft.moving = false
      })
    }
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

export default function Overworld({ map }) {
  const [position, positionDispatch] = React.useReducer(positionReducer, initialPosition)
  const controls = React.useContext(ControlsContext)

  React.useEffect(() => {
    if (controls.direction) {
      positionDispatch({ type: 'MOVE', direction: controls.direction, tiles: map.tiles })
    }
  }, [controls.direction, map.tiles])

  const handleTransitionEnd = React.useCallback(() => {
    if (controls.direction) {
      positionDispatch({
        type: 'MOVE',
        continuous: true,
        direction: controls.direction,
        tiles: map.tiles,
      })
    } else {
      positionDispatch({ type: 'STOP_MOVING' })
    }
  }, [controls.direction, map.tiles])

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
        {map.tiles.map((row, rowIndex) => (
          <div className="tile-row" key={rowIndex}>
            {row.split('').map((item, tileIndex) => (
              <div key={tileIndex} className="tile" {...map.key[item]()} />
            ))}
          </div>
        ))}
      </div>
      <AnimatedSprite cssClass="cecil-sprite" animationState={getAnimationState(position)} />
    </>
  )
}
