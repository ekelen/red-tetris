import { EMPTY_BOARD } from './board'
import { PIECE_LAND, CHECK_LINES } from '../actions/board'
import { merge, checkclearedLines } from '../actions/physics'

const initialState = EMPTY_BOARD

const lockedBoard = (state=initialState, action) => {
  switch(action.type) {
    case PIECE_LAND:
      return merge(state, action.piece)
    case CHECK_LINES:
      return checkclearedLines(state)
    default:
      return state
  }
}

export default lockedBoard