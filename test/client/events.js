import chai from "chai"
import { configureStore } from '../helpers/client'
import rootReducer from '../../src/client/reducers'
import { LEFT, RIGHT, UP, DOWN, handleEvents } from '../../src/client/actions/events'
import { 
  PIECE_FALL, 
  RESET_PIECE,
  MOVE_PIECE,
  ROTATE,
  OFFSET
} from '../../src/client/actions/piece'

chai.should()

describe('Redux events test', () => {
  const E = {
    keyCode: null,
    preventDefault: () => null
  }
  it('should trigger movement on left key pressed', done => {
    const e = {...E, keyCode: LEFT}
    const store = configureStore(rootReducer, null, {}, {
      MOVE_PIECE: () => {
        done()
      }
    })
    store.dispatch(dispatch => handleEvents(dispatch)(e))
  }),
  it('should trigger movement on right key pressed', done => {
    const e = {...E, keyCode: RIGHT}
    const store = configureStore(rootReducer, null, {}, {
      MOVE_PIECE: () => {
        done()
      }
    })
    store.dispatch(dispatch => handleEvents(dispatch)(e))
  }),
  it('should trigger rotation on up key pressed', done => {
    const e = {...E, keyCode: UP}
    const store = configureStore(rootReducer, null, {}, {
      ROTATE: () => {
        done()
      }
    })
    store.dispatch(dispatch => handleEvents(dispatch)(e))
  }),
  it('should trigger piece fall on down key pressed', done => {
    const e = {...E, keyCode: DOWN}
    const store = configureStore(rootReducer, null, {}, {
      PIECE_FALL: () => {
        done()
      }
    })
    store.dispatch(dispatch => handleEvents(dispatch)(e))
  })
})