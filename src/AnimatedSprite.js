import React from 'react'
import { useImageSize } from './hooks'

export default function AnimatedSprite({ spritesheet, cssClass, height, width, animationState }) {
  const spritesheetDimensions = useImageSize(spritesheet.image)
  return (
    <div
      className={`sprite ${cssClass} ${animationState}`}
      style={{
        backgroundImage: `url(${spritesheet.image})`,
        backgroundSize: `calc(var(--unit) * ${spritesheetDimensions.width / spritesheet.gridSize})`,
        height: `calc(var(--unit) * ${height})`,
        width: `calc(var(--unit) * ${width})`,
      }}
    />
  )
}
