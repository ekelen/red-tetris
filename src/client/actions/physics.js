import { cloneDeep } from 'lodash'

// TODO: make it cleaner
export const checkclearedLines = board => {
  const newBoard = cloneDeep(board)
  outer: for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === 0) {
        continue outer
      }
    }
    const row = newBoard.splice(y,1)[0].fill(0)
    newBoard.unshift(row)
  }
  return newBoard
}

export const merge = (board, piece) => {
  const worldShape = piece.shape.map(tile => sumMatrix(tile, piece.pos))
  const newBoard = cloneDeep(board)
  worldShape.forEach(([y, x]) => {
    newBoard[y][x] = piece.color //TODO: add color system
  })
  return newBoard
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
  const newX = x * 0 + y * 1
  const newY = x * -1 + y * 0
  return [newY, newX]
}

export const rotate = shape => shape.map(rotateMatrix)