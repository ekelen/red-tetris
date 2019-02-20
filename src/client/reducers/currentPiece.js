import { PIECE_FALL, RESET_PIECE, MOVE_PIECE, ROTATE } from '../actions/piece'
import { pieces } from '../../pieces'
import { rotate } from '../actions/physics'

const getRandomValue = max => Math.round(Math.random() * Math.floor(max))
const getRandomPiece = () => pieces[getRandomValue(pieces.length - 1)]
const getNewPiece = piece => ({pos: [1, 4], ...piece})

const initialState = getNewPiece(getRandomPiece())

const currentPiece = (state=initialState, action) => {
  switch (action.type) {
    case PIECE_FALL:
      return {...state, pos: [state.pos[0] + 1, state.pos[1]]}
    case RESET_PIECE:
     return action.piece || getNewPiece(getRandomPiece()) //TODO: diff resetPiece / newPiece instead of crappy condition
    case MOVE_PIECE:
      return {...state, pos: [state.pos[0], state.pos[1] + action.dir]}
    case ROTATE:
      return {...state, shape: rotate(state.shape, state.pivot)}
    default:
      return state
  }
}

export default currentPiece