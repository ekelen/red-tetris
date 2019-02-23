import { configureStore } from '../helpers/client'
import rootReducer from '../../src/client/reducers'
import { PIECE_FALL } from '../../src/client/actions/piece'
import chai from "chai"

const INITIAL_STATE = {
  currentPiece: {
    pos: [0,0]
  }
}

chai.should()

describe('Redux board test', () => {
  it('Move the piece down', done => {
    const initialState = INITIAL_STATE
    const store =  configureStore(rootReducer, null, initialState, {
      PIECE_FALL: ({getState}) =>  {
        const state = getState()
        state.currentPiece.pos[0].should.equal(1)
        done()
      }
    })
    store.dispatch({type: PIECE_FALL})
  })
})