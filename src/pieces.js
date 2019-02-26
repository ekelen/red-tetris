import { offAll, offI, offO } from './offsets'

export const pieces = [

  // O
  {
    color: 1,
    offsets: offO,
    rotationIndex: 0,
    shape: [
      [-1, 0], [-1, 1], [0, 0], [0, 1]
    ]
  },

  // I
  {
    color: 2,
    offsets: offI,
    rotationIndex: 0,
    shape: [
      [0, -1], [0, 0], [0, 1], [0, 2]
    ]
  },

  // Z
  {
    color: 3,
    offsets: offAll,
    rotationIndex: 0,
    shape: [
      [-1, -1], [-1, 0],
               [0, 0], [0, 1]
    ]
  },

  // S
  {
    color: 4,
    offsets: offAll,
    rotationIndex: 0,
    shape: [
            [-1, 0], [-1, 1],
     [0, -1], [0, 0]
    ]
  },

  // L
  {
    color: 5,
    offsets: offAll,
    rotationIndex: 0,
    shape: [
                  [-1, 1],
      [0, -1], [0, 0], [0, 1]
    ]
  },

  // J
  {
    color: 6,
    offsets: offAll,
    rotationIndex: 0,
    shape: [
      [-1, -1],
      [0, -1], [0, 0], [0, 1]
    ]
  },

  // T
  {
    color: 7,
    offsets: offAll,
    rotationIndex: 0,
    shape: [
            [-1, 0],
      [0, -1], [0, 0], [0, 1]
    ]
  }
]
