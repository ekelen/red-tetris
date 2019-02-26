// offsets[tryIndex][rotationIndex]

export const offAll = [
  [[0, 0], [0, 0], [0, 0], [0, 0]],
  [[0, 0], [0, 1], [0, 0], [0, -1]],
  [[0, 0], [1, 1], [0, 0], [1, -1]],
  [[0, 0], [-2, 0], [0, 0], [-2, 0]],
  [[0, 0], [-2, 1], [0, 0], [-2, -1]]
]

export const offI = [
  [[0, 0], [0, -1], [-1, -1], [-1, 0]],
  [[0, -1], [0, 0], [-1, 1], [-1, 0]],
  [[0, 2], [0, 0], [-1, -2], [-1, 0]],
  [[0, -1], [-1, 0], [0, 1], [1, 0]],
  [[0, 2], [2, 0], [0, -2], [-2, 0]]
]

export const offO = [
  [[0, 0], [1, 0], [1, -1], [0, -1]]
]
