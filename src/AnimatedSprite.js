import React from 'react'

export default function AnimatedSprite({ cssClass, animationState }) {
  return <div className={`sprite ${cssClass} ${animationState}`} />
}
