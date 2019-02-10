import { PIECE_FALL, RESET_PIECE, MOVE_PIECE, ROTATE } from '../actions/piece'
import { pieces } from '../../pieces'
import { rotate } from '../actions/physics'

const getRandomValue = max => Math.round(Math.random() * Math.floor(max))
const getRandomPiece = () => pieces[getRandomValue(pieces.length - 1)]
const getNewPiece = piece => ({pos: {x: 4, y: 0}, ...piece})

const initialState = getNewPiece(getRandomPiece())

const currentPiece = (state=initialState, action) => {
  switch (action.type) {
    case PIECE_FALL:
      return {...state, pos: {...state.pos, y: state.pos.y + 1}}
    case RESET_PIECE:
     return action.piece || getNewPiece(getRandomPiece()) //TODO: diff resetPiece / newPiece instead of crappy condition
    case MOVE_PIECE:
      return {...state, pos: {...state.pos, x: state.pos.x + action.dir}}
    case ROTATE:
      return {...state, shape: rotate(state.shape, state.pivot)}
    default:
      return state
  }
}

export default currentPiece