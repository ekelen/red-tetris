import { configureStore } from '../helpers/client'
import rootReducer from '../../src/client/reducers'
import { PIECE_FALL } from '../../src/client/actions/piece'
import chai from "chai"

chai.should()

describe('Redux game test', () => {
  it('Move the piece down', done => {
    const initialState = {
      currentPiece: {
        pos: [0,0]
      }
    }
    const store =  configureStore(rootReducer, null, initialState, {
      PIECE_FALL: ({dispatch, getState}) =>  {
        const state = getState()
        state.currentPiece.pos[0].should.equal(1)
        done()
      }
    })
    store.dispatch({type: PIECE_FALL})
  })
})