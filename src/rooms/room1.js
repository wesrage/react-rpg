import room2Map from './room2'

const roomMap = {
  tiles: [
    // prettier-ignore
    'xxxxxxx',
    'x     x',
    'x     xxx',
    'x      0x',
    'x      xx',
    'xxxxxxxx',
  ],
  key: {
    ' ': {
      style: { background: 'orange' },
    },
    x: {
      style: { background: 'forestgreen' },
    },
    0: {
      onStep({ teleport }) {
        teleport({
          map: room2Map,
          x: 1,
          y: 4,
          face: { x: 1 },
        })
      },
    },
  },
}

export default roomMap
