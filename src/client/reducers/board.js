import { EMPTY_BOARD, UPDATE_CURRENT_PIECE } from '../actions/game'
import { cloneDeep } from 'lodash'

const initialState = EMPTY_BOARD

const getUpdatedPiece = (lockedBoard, currentPiece) => {
  const newBoard = cloneDeep(lockedBoard)
  currentPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      const xOff = x + currentPiece.pos.x < newBoard.length ? x + currentPiece.pos.x : 0 //TODO: find real condition 
      const yOff = y + currentPiece.pos.y < newBoard.length ? y + currentPiece.pos.y : 0 //TODO: find real condition
      newBoard[yOff][xOff] = cell
    })
  })
  return newBoard
}

const board = (state=initialState, action) => {
  switch(action.type) {
    case UPDATE_CURRENT_PIECE:
      return getUpdatedPiece(EMPTY_BOARD, action.currentPiece)
    default:
      return state
  }
}

export default board