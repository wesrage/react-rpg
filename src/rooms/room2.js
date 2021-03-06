import room1Map from './room1'

const roomMap = {
  tiles: [
    // prettier-ignore
    '-----xxxxxxx',
    '-----x   c x',
    '-----x     x',
    'xxxxxx     x',
    'x0         x',
    'xxxxxxxxxxxx',
  ],
  key: {
    '-': {},
    ' ': {
      style: { background: 'orange' },
      walkable: true,
    },
    x: {
      style: { background: 'forestgreen' },
    },
    0: {
      walkable: true,
      onStep({ teleport }) {
        teleport({
          map: room1Map,
          x: 7,
          y: 3,
          face: { x: -1 },
        })
      },
    },
    c: {
      onAct({ openDialogue, current }) {
        if (!current) {
          openDialogue([
            'Hey, Cecil!',
            'How are you enjoying the exciting world of React development?',
            'Well... see ya!',
          ])
        }
      },
    },
  },
}

export default roomMap
