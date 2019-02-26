import { configureStore } from '../helpers/client'
import rootReducer from '../../src/client/reducers'
import chai from "chai"
import { parseURL } from '../../src/client/actions/parse'
import { ENTER_GAME_FAIL, SERVER_ENTER_GAME } from '../../src/common/constants';

chai.should()

describe('URL parser', () => {
  it('should return url error for a room with non-alphanumeric, !3-20 char username', () => {
    const urls = ['/room1[weriuh!@#$]', '/room1[we]', '/room1[weriuh!@#$]', '/room1[awefahbwekjfbawjefbhawef]']
    const results = urls.map(url => parseURL(url))
    results.forEach(res => res.type.should.equal(ENTER_GAME_FAIL))
  })

  it('should return url error for a room with non-alphanumeric, !3-20 char roomname', () => {
    const urls = ['/weriuh!@#$[user1]', '/ro[user1]', '/[user1]', '/room1111111111111111111111[user1]']
    const results = urls.map(url => parseURL(url))
    results.forEach(res => res.type.should.equal(ENTER_GAME_FAIL))
  })

  it('should return SERVER_ENTER_GAME with roomName and playerName if given good URL', () => {
    const urls = ['/room1[user1]', '/room123[user123]', '/123ROOM[123USER]', '/roomROOM[userUSER]']
    const results = urls.map(url => parseURL(url))
    results.forEach(res => chai.expect(res).to.have.keys(['type', 'playerName', 'roomName']))
  })
})