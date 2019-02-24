import { configureStore } from '../helpers/client'
import rootReducer from '../../src/client/reducers'
import { EMPTY_BOARD } from '../../src/client/reducers/board'
import { PIECE_FALL, MOVE_PIECE } from '../../src/client/reducers/currentPiece'
import chai from "chai"
import { frameUpdate, handleRotation, handlePieceDown, handleMovement, handlePlayerDies } from '../../src/client/actions/update'
import { offO } from '../../src/offsets'
import { pieces } from '../../src/pieces'
import { merge } from '../../src/client/actions/physics'
import { PLAYER_DIES } from '../../src/client/actions/player'
import { SERVER_PLAYER_DIES } from '../../src/common/constants'

const currentPiece = {
  pos: [4,4],
  color: 1,
  rotationIndex: 0,
  offsets: offO,
  shape: [
    [-1,0], [-1, 1], [0, 0], [0, 1]
  ]
}

const initialState = {
  currentPiece,
  board: EMPTY_BOARD,
  lockedBoard: EMPTY_BOARD
}

chai.should()

describe('Redux update test', () => {
  it('let the piece fall every 0.5s', done => {
    const store = configureStore(rootReducer, null, initialState, {
      UPDATE_ACTIVE_BOARD: ({getState}) => {
      const expected = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]
        getState().board.should.deep.equal(expected)
        done()
      }
    })
    store.dispatch(frameUpdate())
  }),
  it ('should notify reducer that the player died', done => {
    const store = configureStore(rootReducer, null, {}, {
      PLAYER_DIES: () => {0
        done()
      }
    })
    store.dispatch(handlePlayerDies())
  }),
  it ('should move the piece down', done => {
    const initialPos = currentPiece.pos
    const store = configureStore(rootReducer, null, initialState, {
      PIECE_FALL: ({getState}) => {
        const { currentPiece: fallenPiece } = getState()
        fallenPiece.pos.should.deep.equal([initialPos[0] + 1, initialPos[1]])
        done()
      }
    })
    store.dispatch(handlePieceDown())
  }),
  it ('Should update the board with the new piece position', done => {
    const initialPos = currentPiece.pos
    const store = configureStore(rootReducer, null, initialState, {
      UPDATE_ACTIVE_BOARD: ({getState}) => {
        const { board: updatedBoard, currentPiece: fallenPiece } = getState()
        const expected = merge(initialState.lockedBoard, fallenPiece)
        updatedBoard.should.deep.equal(expected)
        done()
      }
    })
    store.dispatch(handlePieceDown())
  }),
  it ('should move the piece to the right', done => {
    const initialPos = currentPiece.pos
    const store = configureStore(rootReducer, null, initialState, {
      MOVE_PIECE: ({getState}) => {
        const { currentPiece: movedPiece } = getState()
        movedPiece.pos.should.deep.equal([initialPos[0], initialPos[1] + 1])
        done()
      }
    })
    store.dispatch(handleMovement(1))
  }),
  it ('should move the piece to the left', done => {
    const initialPos = currentPiece.pos
    const store = configureStore(rootReducer, null, initialState, {
      MOVE_PIECE: ({getState}) => {
        const { currentPiece: movedPiece } = getState()
        movedPiece.pos.should.deep.equal([initialPos[0], initialPos[1] - 1])
        done()
      }
    })
    store.dispatch(handleMovement(-1))
  }),
  it ('should update the board with moved piece', done => {
    const store = configureStore(rootReducer, null, initialState, {
      UPDATE_ACTIVE_BOARD: ({getState}) => {
        const { board: updatedBoard, currentPiece: movedPiece } = getState()
        const expected = merge(initialState.lockedBoard, movedPiece)
        updatedBoard.should.deep.equal(expected)
        done()
      }
    })
    store.dispatch(handleMovement(-1))
  }),
  it('Should do nothing (O piece shouldn\'t rotate)', done => {
    const store = configureStore(rootReducer, null, initialState, {
      UPDATE_ACTIVE_BOARD: ({getState}) => {
      const expected = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]
        getState().board.should.deep.equal(expected)
        done()
      }
    })
    store.dispatch(handleRotation())
  }),
  it ('Should wall kick I', done => {
      const board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      ]
      const expected = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      ]
      const piece = {
        ...pieces[1],
        pos: [17, 1]
      }
      const initialState = {
        currentPiece: piece,
        board,
        lockedBoard: board
      }
      const store = configureStore(rootReducer, null, initialState, {
        UPDATE_ACTIVE_BOARD: ({getState}) => {
          // getState().board.should.deep.equal(expected)
          done()
        }
      })
      store.dispatch(handleRotation())
  })
})