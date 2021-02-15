import room1Map from './room1'

const roomMap = {
  tiles: [
    // prettier-ignore
    '-----xxxxxxx',
    '-----x     x',
    '-----x     x',
    'xxxxxx     x',
    'x0         x',
    'xxxxxxxxxxxx',
  ],
  key: {
    '-': {},
    ' ': {
      style: { background: 'orange' },
    },
    x: {
      style: { background: 'forestgreen' },
    },
    0: {
      onStep({ teleport }) {
        teleport({
          map: room1Map,
          x: 7,
          y: 3,
          face: { x: -1 },
        })
      },
    },
  },
}

export default roomMap
