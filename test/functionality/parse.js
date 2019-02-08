import chai from "chai"
import rootReducer from '../../src/client/reducers'
import io from 'socket.io-client'
import params from '../../params'
import { parseURL } from '../../src/client/actions/parse'
import { startServer } from "../helpers/server";
import { configureStore } from "../helpers/client";

chai.should()

describe('Multiplayer gatekeeping', () => {
  let tetrisServer

  before(cb => startServer( params.serverTest, (err, server) => {
    tetrisServer = server
    cb()
  }))

  after(done => {
    tetrisServer.stop(done)
  })

  it('should create multiplayer game if given good URL', done => {
    const initialState = {}
    const socket = io(params.serverTest.url)
    const store =  configureStore(rootReducer, socket, initialState, {
      'CREATE_MULTIPLAYER_GAME': () =>  done()
    })
    store.dispatch(parseURL('/2-bananaband[joe]'))
  })

  it('shouldn\'t let the player join a room with non-unique username')
  it('shouldn\'t let the player join a room with non-alphanumeric, !3-20 char username')
  it('shouldn\'t let the player create a room with non-alphanumeric, !3-20 char roomname')
  it('shouldn\'t let the player make a room with < 2 or > 5 players')
  it('shouldn\'t let the player put badly formatted nPlayers specifier')

  it('should join multiplayer game if given good existing game URL', done => {
    const initialState = {}
    const socket = io(params.serverTest.url)
    const store = configureStore(rootReducer, socket, initialState, {
      'JOIN_MULTIPLAYER_GAME': () => done(),
      'ROOM_ERROR': action => done(new Error(action.err))
    })
    store.dispatch(parseURL('/2-bananaband[jane]'))
  })

  it('shouldn\'t let the player join a full room', done => {
    const initialState = {}
    const socket = io(params.serverTest.url)
    const store =  configureStore(rootReducer, socket, initialState, {
      'ROOM_ERROR': () =>  done()
    })
    store.dispatch(parseURL('/2-bananaband[pete]'))
  })
})
