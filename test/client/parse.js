import { configureStore } from '../helpers/client'
import rootReducer from '../../src/client/reducers'
import chai from "chai"
import { parseURL } from '../../src/client/actions/parse'

chai.should()

describe('URL parser', () => {
  it('should return url error for a room with non-alphanumeric, !3-20 char username')
  it('should return url error for a room with non-alphanumeric, !3-20 char roomname')
  it('should return url error for a room with < 2 or > 5 players')
  it('should return url error for badly formatted nPlayers specifier')
})