import { PIECE_FALL, RESET_PIECE, MOVE_PIECE, ROTATE, OFFSET, GET_NEXT_PIECE } from '../actions/piece'
import { pieces } from '../../pieces'
import { rotate, getOffsetPos, computeOffset } from '../actions/physics'
import { UPDATE_GAME, PIECE_START_POS } from '../../common/constants';

// const getRandomValue = max => Math.round(Math.random() * Math.floor(max))
// const getNewPiece = piece => ({ pos: PIECE_START_POS, ...piece })

const initialState = {
  color: null,
  pos: null,
  shape: null,
  rotationIndex: null,
  offsets: null
}

const currentPiece = (state = initialState, action) => {
  switch (action.type) {
  case PIECE_FALL:
    return { ...state, pos: [state.pos[0] + 1, state.pos[1]] }
  case RESET_PIECE:
    return action.piece
  case MOVE_PIECE:
    return {...state, pos: [state.pos[0], state.pos[1] + action.dir]}
  case ROTATE:
    return {
      ...state,
      shape: rotate(state.shape, state.pivot),
      rotationIndex: state.rotationIndex == 3 ? 0 : state.rotationIndex + 1
    }
  case OFFSET:
    const { rotationIndex, offsets, pos } = state
    const { tryIndex, fromIndex } = action
    const offset = computeOffset(offsets, tryIndex, rotationIndex, fromIndex)
    return {
      ...state,
      pos: getOffsetPos(pos, offset)
    }
  case GET_NEXT_PIECE:
    return {
      ...state,
      ...action.nextPiece,
      pos: PIECE_START_POS
    }
  case UPDATE_GAME:
    const { pieceLineup } = action
    const index = pieceLineup[0]
    const firstPiece = pieces[index]
    return state.shape ? { ...state } : { ...firstPiece, pos: PIECE_START_POS }
  default:
    return state
  }
}

export default currentPiece