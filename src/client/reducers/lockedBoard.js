import { EMPTY_BOARD, PIECE_LAND } from '../actions/game'
import { merge } from '../actions/physics'

const initialState = EMPTY_BOARD

const lockedBoard = (state=initialState, action) => {
  switch(action.type) {
    case PIECE_LAND:
      return merge(state, action.piece)
    default:
      return state
  }
}

export default lockedBoard