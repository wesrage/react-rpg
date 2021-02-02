import { useWindowSize } from './hooks'
const ASPECT_RATIO_WIDTH = 16
const ASPECT_RATIO_HEIGHT = 9

export default function GameFrame() {
  const { height, width } = useWindowSize()
  let style = {}
  if (height / ASPECT_RATIO_HEIGHT < width / ASPECT_RATIO_WIDTH) {
    style = { height, width: (height * ASPECT_RATIO_WIDTH) / ASPECT_RATIO_HEIGHT }
  } else {
    style = { width, height: (width * ASPECT_RATIO_HEIGHT) / ASPECT_RATIO_WIDTH }
  }
  return (
    <div
      style={{
        fontSize: style.height / ASPECT_RATIO_HEIGHT,
        background: 'black',
        aspectRatio: `${ASPECT_RATIO_WIDTH} / ${ASPECT_RATIO_HEIGHT}`,
        ...style,
      }}
    />
  )
}
