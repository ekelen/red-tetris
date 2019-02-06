import { PIECE_FALL, RESET_PIECE, MOVE_PIECE } from '../actions/piece'
import { shapes } from '../../shapes'

const getRandomValue = max => Math.round(Math.random() * Math.floor(max))
const getRandomShape = () => shapes[getRandomValue(shapes.length)]
const getNewPiece = shape => ({pos: {x: 4, y: 0}, shape})

const initialState = getNewPiece(getRandomShape())

const currentPiece = (state=initialState, action) => {
  switch (action.type) {
    case PIECE_FALL:
      return {...state, pos: {...state.pos, y: state.pos.y + 1}}
    case RESET_PIECE:
     return action.piece || getNewPiece(getRandomShape()) //TODO: diff resetPiece / newPiece instead of crappy condition
    case MOVE_PIECE:
      return {...state, pos: {...state.pos, x: state.pos.x + action.dir}}
    default:
      return state
  }
}

export default currentPiece