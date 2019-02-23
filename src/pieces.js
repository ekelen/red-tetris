import { offAll, offI, offO } from './offsets'

export const pieces = [
  {
    color: 1,
    offsets: offO,
    rotationIndex: 0,
    shape: [
      [-1,0], [-1, 1], [0, 0], [0, 1] //O
    ]
  }, {
    color: 2,
    offsets: offI,
    rotationIndex: 0,
    shape: [
        [0,-1], [0,0], [0,1], [0,2] //I
      ]
    },
  {
    color: 3,
    offsets: offAll,
    rotationIndex: 0,
    shape: [
      [-1,0], [-1,1], [0,-1], [0,0]
    ]
  },
  {
    color: 4,
    offsets: offAll,
    rotationIndex: 0,
    shape: [
      [-1,-1], [-1,0], [0,0], [0,1] //S
    ]
  },
  {
    color: 5,
    offsets: offAll,
    rotationIndex: 0,
    shape: [
      [-1,0],[0,0],[1,0],[1,1] //L
    ]
  },
  {
    color: 6,
    offsets: offAll,
    rotationIndex: 0,
    shape: [
      [-1,0],[0,0],[1,0],[1,-1] //J
    ]
  },
  {
    color: 7,
    offsets: offAll,
    rotationIndex: 0,
    shape: [
      [-1,-1], [-1,0], [-1,1], [0,0] //T
    ]
  }
]