import { cloneDeep } from 'lodash'

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