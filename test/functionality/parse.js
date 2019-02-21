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
import { SERVER_START_GAME, SERVER_PLAYER_DIES } from '../../src/common/constants';

chai.should()

describe('Game creation based on URL', () => {
  let tetrisServer = null
  const games = []
  const sockets = {
    user1: null, user2: null, user3: null, user4: null, user5: null, user6: null
  }
  const stores = {
    user1: null, user2: null, user3: null, user4: null, user5: null, user6: null
  }

  before(done => {
    server.create(params.serverTest, games)
      .then(
        server => { tetrisServer = server; done() },
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

  it('creates multiplayer game if given good URL', done => {
    const initialState = {}
    sockets.user1 = io(params.serverTest.url)
    stores.user1 = configureStore(rootReducer, sockets.user1, initialState,
      {
        CREATE_GAME_SUCCESS: ({ getState }) =>
        {
          const state = getState()
          state.game.roomName.should.equal('testroom')
          state.game.players.map(p => p.playerName).should.include('user1')
          done()
        },
        ENTER_GAME_FAIL: (action) => done(new Error(action.error))
      }
    );
    stores.user1.dispatch(parseURL('/testroom[user1]'))
  })

  it('lets another player join if given good existing game URL', done => {
    const initialState = {}
    sockets.user2 = io(params.serverTest.url)
    stores.user2 = configureStore(rootReducer, sockets.user2, initialState, {
      UPDATE_GAME: ({ getState }) =>
      {
        const state = getState()
        state.game.players.length.should.equal(2)
        state.game.players.map(p => p.playerName).should.include('user2')
        state.game.players.map(p => p.playerName).should.include('user1')
        done()
      },
      CREATE_GAME_SUCCESS: () => done(new Error('Should not have created a new game.')),
      ENTER_GAME_FAIL: action => done(new Error(action.err))
    })
    stores.user2.dispatch(parseURL('/testroom[user2]'))
  })

  it('makes 6th player wait', done => {
    const initialState = {}
    sockets.user3 = io(params.serverTest.url)
    sockets.user4 = io(params.serverTest.url)
    sockets.user5 = io(params.serverTest.url)
    sockets.user6 = io(params.serverTest.url)

    stores.user3 = configureStore(rootReducer, sockets.user3, initialState, {})
    stores.user3.dispatch(parseURL('/testroom[user3]'))

    stores.user4 = configureStore(rootReducer, sockets.user4, initialState, {})
    stores.user4.dispatch(parseURL('/testroom[user4]'))

    stores.user5 = configureStore(rootReducer, sockets.user5, initialState, {})
    stores.user5.dispatch(parseURL('/testroom[user5]'))

    setTimeout(() =>
      { stores.user6 = configureStore(rootReducer, sockets.user6, initialState, {
        UPDATE_GAME: ({ getState }) =>
        {
          const state = getState()
          state.game.players.length.should.equal(6)
          state.game.players.map(p => p.playerName).should.include('user6')
          state.player.waiting.should.equal(true)
          done()
        },
      })
      stores.user6.dispatch(parseURL('/testroom[user6]'))
    }, 300)
  })

  it('adds new game to global games variable', () => {
    games.map(game => game.roomName).should.include('testroom')
  })

  it('has 6 players', () => {
    chai.expect(stores.user1.getState()).to.include.keys(['game', 'player'])
    chai.expect(stores.user1.getState().game.players).to.have.lengthOf(6)
    chai.expect(stores.user2.getState().game.players).to.have.lengthOf(6)
    chai.expect(stores.user3.getState().game.players).to.have.lengthOf(6)
  })

  it('sets game inProgress to true if game is started', (done) => {
    // TODO: Uhh don't recreate store somehow but find better solution than setTimeout
    stores.user1.dispatch({ type: SERVER_START_GAME })
    setTimeout(() => { stores.user1.getState().game.inProgress.should.equal(true); done() }, 500)
  })

  it('if user2 leaves the room, there are now 5 players (4 active)', (done) => {
    sockets.user2.disconnect()
    setTimeout(() => {
      stores.user1.getState().game.players.length.should.equal(5);
      stores.user1.getState().game.activePlayers.length.should.equal(4);
      stores.user3.getState().game.activePlayers.length.should.equal(4);
      sockets.user2 = null
      stores.user2 = null
      done() }, 300)
  })

  it('if user3 dies, user3 is dead, but active player count is still 4', (done) => {
    stores.user3.dispatch({ type: SERVER_PLAYER_DIES })
    setTimeout(() => {
      stores.user3.getState().player.alive.should.equal(false);
      stores.user3.getState().game.activePlayers.length.should.equal(4);
      done() }, 300)
  })

  it('if user4 and user5 die, game is stopped (user1 only active + alive player)', (done) => {
    stores.user4.dispatch({ type: SERVER_PLAYER_DIES })
    stores.user5.dispatch({ type: SERVER_PLAYER_DIES })
    setTimeout(() => {
      stores.user4.getState().game.inProgress.should.equal(false);
      done()
    }, 300)
  })

  it('user6 is active because game ended & has space', () => {
    stores.user6.getState().player.waiting.should.equal(false);
  })

  it('if user1 leaves, user3 becomes the lead player', (done) => {
    sockets.user1.disconnect()
    setTimeout(() => {
      stores.user4.getState().game.players[0].playerName.should.equal('user3');
      done()
    }, 300)
  })

  it('removes game from global games array when all players leave', done => {
    sockets.user3.disconnect()
    sockets.user4.disconnect()
    sockets.user5.disconnect()
    sockets.user6.disconnect()
    setTimeout(() => { games.length.should.equal(0); done() }, 300);
  })
})
