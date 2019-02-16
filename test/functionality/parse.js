/* eslint-env node, mocha */
import chai from "chai"
import rootReducer from '../../src/client/reducers'
import io from 'socket.io-client'
import params from '../../params'
import { parseURL } from '../../src/client/actions/parse'
import { configureStore } from '../helpers/client'
import * as server from '../../src/server/index'
import { ping } from '../../src/client/actions/server';

chai.should()

describe('Game creation based on URL', () => {
  let tetrisServer = null
  let games = []

  before(done => {
    server.create(params.serverTest, games)
      .then(
        server => { tetrisServer = server; done(); },
        err => { done(err) })
  })

  after(done => {
    tetrisServer ? tetrisServer.stop(done) : done()
  })

  it('should pong', done => {
    const initialState = {}
    const socket = io(params.serverTest.url)
    const store = configureStore(rootReducer, socket, initialState, {
      'pong': () => done()
    })
    store.dispatch(ping())
  });

  it('should create multiplayer game if given good URL', done => {
    const initialState = {}
    const socket = io(params.serverTest.url)
    const store = configureStore(rootReducer, socket, initialState,
      {
        CREATE_GAME_SUCCESS: () => done(),
        ENTER_GAME_FAIL: (action) => done(new Error(action.error))
      }
    );
    store.dispatch(parseURL('/testroom[user1]'))
  })

  it('should join multiplayer game if given good existing game URL', done => {
    const initialState = {}
    const socket = io(params.serverTest.url)
    const store = configureStore(rootReducer, socket, initialState, {
      JOIN_GAME_SUCCESS: () => done(),
      CREATE_GAME_SUCCESS: () => done(new Error('Should not have created a new game.')),
      ENTER_GAME_FAIL: action => done(new Error(action.err))
    })
    store.dispatch(parseURL('/testroom[user2]'))
  })

  it('should have added game to global games variable', () => {
    games.map(game => game.roomName).should.include('testroom')
  })
})
