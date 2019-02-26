/* eslint-env node, mocha */
import chai from "chai"
import rootReducer from '../../src/client/reducers'
import io from 'socket.io-client'
import params from '../../params'
import { parseURL } from '../../src/client/actions/parse'
import { configureStore } from '../helpers/client'
import * as server from '../../src/server/index'
import { ping } from '../../src/client/actions/server';
import { cloneDeep } from 'lodash'
import { SERVER_START_GAME, SERVER_PLAYER_DIES } from '../../src/common/constants'
import { socketMiddleWare } from '../../src/client/middleware/socketMiddleWare'

chai.should()

describe('Integration tests: multiplayer game', () => {
  let tetrisServer = null, store = null, socket = null
  const games = []
  const doNext = () => {}

  before(done => {
    server.create(params.serverTest, games)
      .then(
        server => {
          tetrisServer = server;
          done() },
        err => { done(err) })
  })

  after(done => {
    tetrisServer ? tetrisServer.stop(done) : done()
  })

  it('Should return a function if not a server action', () => {
    const nextHandler = socketMiddleWare(socket)(doNext)({type: 'NOT_A_SERVER_ACTION'})
    chai.assert.isFunction(nextHandler)
  })
})