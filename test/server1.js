import chai from "chai"
import {startServer, configureStore} from './helpers/server'
import rootReducer from '../src/client/reducers'
import {ping} from '../src/client/actions/server'
import io from 'socket.io-client'
import params from '../params'
import { parseURL } from '../src/client/actions/parse'

chai.should()

describe('Server test', () => {
  let tetrisServer

  before(cb => startServer( params.serverTest, (err, server) => {
    tetrisServer = server
    cb()
  }))

  after(done => {
    tetrisServer.stop(done)
  })

  it('should create multiplayer game', done => {
    const initialState = {}
    const socket = io(params.serverTest.url)
    const store =  configureStore(rootReducer, socket, initialState, {
      'CREATE_MULTIPLAYER_GAME': () =>  done()
    })
    store.dispatch(parseURL('/2-bananaband[joe]'))
  })

  it('should enter multiplayer game', done => {
    const initialState = {}
    const socket = io(params.serverTest.url)
    const store =  configureStore(rootReducer, socket, initialState, {
      'ENTER_MULTIPLAYER_GAME': () =>  done(),
      'ROOM_ERROR': action =>  done(new Error('action.err'))
    })
    store.dispatch(parseURL('/2-bananaband[joe]'))
  })

  it('shouldn\'t let the player join a full room', done => {
    const initialState = {}
    const socket = io(params.serverTest.url)
    const store =  configureStore(rootReducer, socket, initialState, {
      'ROOM_ERROR': () =>  done()
    })
    store.dispatch(parseURL('/2-bananaband[joe]'))
  })
})
