import chai from "chai"
import { configureStore } from '../helpers/client'
import rootReducer from '../../src/client/reducers'
import { offO } from '../../src/offsets'
import { LEFT, RIGHT, UP, DOWN, handleEvents } from '../../src/client/actions/events'
import {
  PIECE_FALL,
  RESET_PIECE,
  MOVE_PIECE,
  ROTATE,
  OFFSET
} from '../../src/client/actions/piece'
import { EMPTY_BOARD } from "../../src/client/reducers/board";

chai.should()

const initialState = {
  currentPiece: {
    pos: [4,4],
    color: 1,
    rotationIndex: 0,
    offsets: offO,
    shape: [
      [-1,0], [-1, 1], [0, 0], [0, 1]
    ]
  },
  game: { inProgress: true},
  player: { 
    alive: true,
    ghost: EMPTY_BOARD
  }
}

describe('Redux events test', () => {
  const E = {
    keyCode: null,
    preventDefault: () => null
  }
  it('should trigger movement on left key pressed', done => {
    const e = {...E, keyCode: LEFT}
    const store = configureStore(rootReducer, null, initialState, {
      MOVE_PIECE: () => {
        done()
      }
    })
    store.dispatch((dispatch, getState) => handleEvents(dispatch, getState)(e))
  })
  it('should trigger movement on right key pressed', done => {
    const e = {...E, keyCode: RIGHT}
    const store = configureStore(rootReducer, null, initialState, {
      MOVE_PIECE: () => {
        done()
      }
    })
    store.dispatch((dispatch, getState) => handleEvents(dispatch, getState)(e))
  })
  it('should trigger rotation on up key pressed', done => {
    const e = {...E, keyCode: UP}
    const store = configureStore(rootReducer, null, initialState, {
      ROTATE: () => {
        done()
      }
    })
    store.dispatch((dispatch, getState) => handleEvents(dispatch, getState)(e))
  }),
  it('should trigger piece fall on down key pressed', done => {
    const e = {...E, keyCode: DOWN}
    const store = configureStore(rootReducer, null, initialState, {
      PIECE_FALL: () => {
        done()
      }
    })
    store.dispatch((dispatch, getState) => handleEvents(dispatch, getState)(e))
  })
})