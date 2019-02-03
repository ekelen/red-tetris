import { EMPTY_BOARD, UPDATE_CURRENT_PIECE } from '../actions/game'
import { merge } from '../actions/physics'

const initialState = EMPTY_BOARD

const board = (state=initialState, action) => {
  switch(action.type) {
    case UPDATE_CURRENT_PIECE:
      return merge(action.lockedBoard, action.currentPiece)
    default:
      return state
  }
}

export default board