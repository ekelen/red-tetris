import { configureStore } from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import chai from "chai"
import { parseURL } from '../../src/client/actions/parse'

chai.should()

describe('URL parser', () => {
  it('Should start singleplayer game if no hash part of URL', done => {
    const initialState = {}
    const store = configureStore(rootReducer, null, initialState, {
      START_SINGLE_PLAYER_GAME: ({getState}) => {
        const state = getState()
        state.game.started.should.equal(true)
        done()
      }
    })
    store.dispatch(parseURL('/'))
  })
  it('should return url error for a room with non-alphanumeric, !3-20 char username')
  it('should return url error for a room with non-alphanumeric, !3-20 char roomname')
  it('should return url error for a room with < 2 or > 5 players')
  it('should return url error for badly formatted nPlayers specifier')
})