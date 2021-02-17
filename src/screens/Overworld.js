import React from 'react'
import classnames from 'classnames'
import { controlsStore } from '../store/controls'
import { locationStore, MoveState } from '../store/location'
import AnimatedSprite from '../AnimatedSprite'
import Tile from '../Tile'
import '../cecil.overworld.css'

function getAnimationState(location) {
  if (location.face.x > 0) {
    return location.moveState === MoveState.MOVING ? 'cecil-walk-right' : 'cecil-idle-right'
  }
  if (location.face.x < 0) {
    return location.moveState === MoveState.MOVING ? 'cecil-walk-left' : 'cecil-idle-left'
  }
  if (location.face.y < 0) {
    return location.moveState === MoveState.MOVING ? 'cecil-walk-up' : 'cecil-idle-up'
  }
  if (location.face.y > 0) {
    return location.moveState === MoveState.MOVING ? 'cecil-walk-down' : 'cecil-idle-down'
  }
}

export default function Overworld() {
  const controls = React.useContext(controlsStore)
  const { location, move, teleport, endMove, teleportOut, endTeleport } = React.useContext(
    locationStore,
  )

  React.useEffect(() => {
    if (controls.direction) {
      move(controls.direction)
    }
  }, [move, controls.direction])

  const handleTransitionEnd = React.useCallback(() => {
    const mapChar = location.map.tiles[location.y][location.x]
    if (location.moveState === MoveState.MOVING && location.map.key[mapChar].onStep) {
      location.map.key[mapChar].onStep({ teleport })
    } else if (location.moveState === MoveState.TELEPORTING_IN) {
      teleportOut()
    } else if (location.moveState === MoveState.TELEPORTING_OUT) {
      endTeleport()
    } else if (controls.direction) {
      move(controls.direction, { continue: true })
    } else {
      endMove()
    }
  }, [move, endMove, teleport, teleportOut, endTeleport, location, controls.direction])

  return (
    <>
      <div
        onTransitionEnd={handleTransitionEnd}
        className={classnames('overworld', {
          'teleporting--out': location.moveState === MoveState.TELEPORTING_OUT,
          'teleporting--in': location.moveState === MoveState.TELEPORTING_IN,
          teleporting:
            location.moveState === MoveState.TELEPORTING_OUT ||
            location.moveState === MoveState.TELEPORTING_IN,
        })}
        style={{
          left: `calc((((var(--aspect-width) - 1) / 2) - ${location.x}) * var(--unit))`,
          top: `calc((((var(--aspect-height) - 1) / 2) - ${location.y}) * var(--unit))`,
        }}
      >
        {location.map.tiles.map((row, rowIndex) => (
          <div className="tile-row" key={rowIndex}>
            {row.split('').map((item, tileIndex) => {
              return <Tile key={tileIndex} {...location.map.key[item]} />
            })}
          </div>
        ))}
      </div>
      <AnimatedSprite cssClass="cecil-sprite" animationState={getAnimationState(location)} />
    </>
  )
}
