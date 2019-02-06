import { PIECE_FALL, RESET_PIECE, MOVE_PIECE } from '../actions/piece'

const initialState = {
  pos: {x: 4, y: 0},
  shape: [
    [1,0,0],
    [1,1,1],
    [0,0,0]
  ]
}

const currentPiece = (state=initialState, action) => {
  switch (action.type) {
    case PIECE_FALL:
      return {...state, pos: {...state.pos, y: state.pos.y + 1}}
    case RESET_PIECE:
     return action.piece || initialState
    case MOVE_PIECE:
      return {...state, pos: {...state.pos, x: state.pos.x + action.dir}}
    default:
      return state
  }
}

export default currentPiece