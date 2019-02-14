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

  before(done => {
    server.create(params.serverTest)
      .then(
        server => { tetrisServer = server; done(); },
        err => { done(err) })
  })

  after(done => {
    tetrisServer ? tetrisServer.stop(done) : done()
  })

  it('should pong', done => {
    const initialState = {}
    const socket = io(params.server.url)
    const store = configureStore(rootReducer, socket, initialState, {
      'pong': () => done()
    })
    store.dispatch(ping())
  });

  // it('should create multiplayer game if given good URL', done => {
  //   const initialState = {}
  //   const socket = io(params.serverTest.url)
  //   const store = configureStore(rootReducer, socket, initialState,
  //     {
  //       CREATE_GAME_SUCCESS: () => done(),
  //       ENTER_GAME_FAIL: (action) => done(new Error(action.error))
  //     }
  //   );
  //   store.dispatch(parseURL('/room[user1]'))
  // })

  it('shouldn\'t let the player join a room with non-unique username')
  it('shouldn\'t let the player join a room with non-alphanumeric, !3-20 char username')
  it('shouldn\'t let the player create a room with non-alphanumeric, !3-20 char roomname')
  it('shouldn\'t let the player make a room with < 2 or > 5 players')
  it('shouldn\'t let the player put badly formatted nPlayers specifier')

  // it('should join multiplayer game if given good existing game URL', done => {
  //   const initialState = {}
  //   const socket = io(params.serverTest.url)
  //   const store = configureStore(rootReducer, socket, initialState, {
  //     JOIN_GAME_SUCCESS: () => done(),
  //     ENTER_GAME_FAIL: action => done(new Error(action.err))
  //   })
  //   store.dispatch(parseURL('/room[user2]'))
  // })

  // it('shouldn\'t let the player join a full room', done => {
  //   const initialState = {}
  //   const socket = io(params.serverTest.url)
  //   const store =  configureStore(rootReducer, socket, initialState, {
  //     ENTER_GAME_FAIL: () => done()
  //   })
  //   store.dispatch(parseURL('/room[pete]'))
  // })
})
