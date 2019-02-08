import { configureStore } from '../helpers/client'
import rootReducer from '../../src/client/reducers'
import { MOVE_PIECE, PIECE_FALL } from '../../src/client/actions/piece'
import { move } from '../../src/client/actions/update'
import chai from "chai"

const INITIAL_STATE = {
  currentPiece: {
    pos: {x:0, y:0}
  }
}

chai.should()

describe('Redux update test', () => {

  it('Move the piece down', done => {
    const initialState = INITIAL_STATE
    const store =  configureStore(rootReducer, null, initialState, {
      PIECE_FALL: ({dispatch, getState}) =>  {
        const state = getState()
        state.currentPiece.pos.y.should.equal(1)
        done()
      }
    })
    store.dispatch({type: PIECE_FALL})
  })
})