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


//TODO: to be tested
export const merge = (board, piece) => {
  const newBoard = cloneDeep(board)
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== 0) {
        const yOff = piece.pos.y + y
        const xOff = piece.pos.x + x
        newBoard[yOff][xOff] = cell;
      }
    })
  })
  return newBoard
}


//TODO: to be tested
export const isColliding = (board, currentPiece) => {
  const len = currentPiece.shape.length;
  for (let y = 0; y < len; y++) {
    for (let x = 0; x < len; x++) {
      if (currentPiece.shape[y][x] !== 0) {
        const xOff = x + currentPiece.pos.x 
        const yOff = y + currentPiece.pos.y
        if (
          board[yOff] == undefined || 
          board[yOff][xOff] != 0
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

const subMatrix = (a,b = [1,1]) => a.map((e, i) => e - b[i])
const addMatrix = (a,b = [1,1]) => a.map((e, i) => e + b[i])

//Clockwise rotation
const rotateMatrix = ([y, x]) => {
  const newX = x * 0 + y * 1
  const newY = x * -1 + y * 0
  return [newY, newX]
}

//TODO: to be tested
export const rotate = (shape, pivot) => {
  const newPiece = cloneDeep(shape)
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      const relCoords = subMatrix([y, x], pivot)
      const [ny, nx] = rotateMatrix(relCoords)
      const [yy, xx] = addMatrix([ny, nx], pivot)
      newPiece[yy][xx] = shape[y][x]
    }
  }
  return newPiece
}