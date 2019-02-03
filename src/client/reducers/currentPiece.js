import { PIECE_FALL, RESET_PIECE } from '../actions/game'

const initialState = {
  pos: {x: 4, y: 10},
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
     return {...state, pos: {x:4, y: 10}}
    default:
      return state
  }
}

export default currentPiece