import { PIECE_FALL, RESET_PIECE, MOVE_PIECE, ROTATE, OFFSET, GET_NEXT_PIECE } from '../actions/piece'
import { pieces } from '../../pieces'
import { rotate, getOffsetPos, computeOffset } from '../actions/physics'
import { CREATE_GAME_SUCCESS } from '../../common/constants';

const getRandomValue = max => Math.round(Math.random() * Math.floor(max))
// const getRandomPiece = () => pieces[getRandomValue(pieces.length - 1)]
const getNewPiece = piece => ({ pos: [1, 4], ...piece })

// const initialState = getNewPiece(getRandomPiece())

const initialState = {
  pos: [1, 4],
  piece: []
}

const currentPiece = (state = initialState, action) => {
  switch (action.type) {
    case PIECE_FALL:
      return { ...state, pos: [state.pos[0] + 1, state.pos[1]] }
    case RESET_PIECE:
      return action.piece
    //  return action.piece || getNewPiece(getRandomPiece()) //TODO: diff resetPiece / newPiece instead of crappy condition
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
        pos: [1, 4]
      }
    case CREATE_GAME_SUCCESS:
      const { pieceLineup } = action
      const index = pieceLineup[0]
      const piece = pieces[index]
      return { ...state, ...piece, pos: [1, 4] }
    default:
      return state
  }
}

export default currentPiece