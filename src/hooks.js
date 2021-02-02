import React from 'react'

function getWindowSize() {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
  }
}

export function useWindowSize() {
  const [size, setSize] = React.useState(getWindowSize())
  React.useEffect(() => {
    function handleResize() {
      setSize(getWindowSize())
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return size
}
