import { PIECE_FALL } from '../actions/game'

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
    default:
      return state
  }
}

export default currentPiece