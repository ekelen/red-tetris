import { cloneDeep } from 'lodash'
import { EMPTY_BOARD } from '../reducers/board'

export const merge = (board, piece) => {
  const worldShape = piece.shape.map(tile => sumMatrix(tile, piece.pos))
  const newBoard = cloneDeep(board)
  worldShape.forEach(([y, x]) => {
    newBoard[y][x] = piece.color
  })
  return newBoard
}

export const getPieceToLock = (lastPiece, board) => {
  const newPiece = cloneDeep({
    ...lastPiece, 
    pos: [lastPiece.pos[0] + 1, lastPiece.pos[1]]
  })
  if (isColliding(board, newPiece)) {
    return lastPiece
  }
  return getPieceToLock(newPiece, board)
}

export const isColliding = (board, piece) => {
  const worldShape = piece.shape.map(tile => sumMatrix(tile, piece.pos))
  const colliding = worldShape.some(([y, x]) => {
    return (
      board[y] === undefined ||
      board[y][x] === undefined ||
      board[y][x] !== 0
    )
  })
  return colliding
}

const subMatrix = (a,b) => a.map((e, i) => e - b[i])
const sumMatrix = (a,b) => a.map((e, i) => e + b[i])

//Clockwise rotation
const rotateMatrix = ([y, x]) => {
  const newY = x
  const newX = -1 * y
  return [newY, newX]
}

export const computeOffset = (offsets, tryIndex, rotationIndex, fromIndex) => {
  const a = offsets[tryIndex][rotationIndex]
  const b = offsets[tryIndex][fromIndex]
  return subMatrix(b,a)
}

export const getOffsetPos = (pos, offset) => {
  return sumMatrix(pos, offset)
}

export const isPlayerDead = board => {
  const hiddenRows = board.slice(0,4)
  const flatten = hiddenRows.reduce((acc, val) => acc.concat(val), [])
  const count = flatten.reduce((acc, val) => acc + val, 0)
  return count > 0
}

export const rotate = shape => shape.map(rotateMatrix)

// Return new board with lines cleared (if any)
export const clearLines = (board, indexes) => {
  const nLines = indexes.length
  if (!nLines) return board
  const remainingLines = cloneDeep(board).filter((_, y) => !indexes.includes(y))
  const newBoard = EMPTY_BOARD.slice(0, nLines).concat(remainingLines)
  return newBoard
}

// Returns row indexes of lines to clear
export const getClearedLines = board => {
  const indexes = board
    .map((row, y) => ({ y, row }))
    .filter((r) => r.row.every(x => x > 0 && x < 8)) // 8 corresponds to locked penaltie lines and cannot be destroyed
    .map((r) => r.y)
  return indexes
}

// Return ghost with locked penaltie lines
// export const getGhostWithPenaltieLines = (ghost, nlines) => {
//   const penaltieLines = Array(nlines).fill(Array(10).fill(8))
//   const ghostWithPenaltieLines = [...ghost, ...penaltieLines].slice(nlines)
//   return ghostWithPenaltieLines
// }
