/* eslint-env node, mocha */
import chai from "chai"
import Game from "../../src/server/Game.class";
import { START_N_PIECES, N_PIECES_TO_APPEND } from '../../src/common/constants';

chai.should()

class MockPlayer {
  constructor({
    playerName,
    socketId
  }) {
    this.playerName = playerName
    this.pieceIndex = 0
    this.alive = null
    this.socket = {
      id: socketId,
      join: (...params) => {}
    }
    this.ghost = new Array(20).fill(new Array(10).fill(0))
    this.waiting = false
    this.actionToRoom = (roomName, action) => {}
    this.actionToClient = (roomName, action) => {}
  }
}

const fredParams = {
  playerName: 'fred',
  socketId: '1'
}
const jimParams = {
  playerName: 'jim',
  socketId: '2'
}

const georgeParams = {
  playerName: 'george',
  socketId: '10'
}

const amyParams = {
  playerName: 'amy',
  socketId: '11'
}

const claraParams = {
  playerName: 'clara',
  socketId: '12'
}

const jillParams = {
  playerName: 'jill',
  socketId: '14'
}

describe('Game constructor', () => {
  let games, game, janeParams, fredsGame
  let fred

  before(() => {
    fred = new MockPlayer(fredParams)
    fredsGame = new Game({
      player: fred,
      roomName: 'fredsroom'
    })
  })

  beforeEach(() => {
    game = null
    games = []

    janeParams = {
      playerName: 'jane',
      socketId: '13'
    }
  })

  it('has methods playerDies, playerDestroysLine, playerLocksPiece, playerLeavesGame', () => {
    chai.expect(fredsGame).to.respondTo('playerDies')
    .and.respondTo('playerDestroysLine')
    .and.respondTo('playerLeavesGame')
    .and.respondTo('playerLocksPiece')
  })

  it('throws if roomName is not unique')

  it('throws if roomName is not alphanumeric', () => {
    const player = new MockPlayer(janeParams)
    const roomName = '!@#$'
    const res = (player, roomName) => new Game({ player, roomName })
    chai.expect(res.bind(res, player, roomName)).to.throw(/room/i)
  })

  it('throws if player has no name', () => {
    janeParams.playerName = ''
    const player = new MockPlayer(janeParams)
    const roomName = 'janesroom'
    const res = (player, roomName) => new Game({ player, roomName })
    chai.expect(res.bind(res, player, roomName)).to.throw(/missing/i)
  })

  it('creates a new game when given valid player object and roomName', () => {
    const roomName = 'janesroom'
    const player = new MockPlayer(janeParams)
    const res = new Game({ player, roomName })
    res.should.be.instanceOf(Game)
  })

  it('has 50 (START_N_PIECES) tetraminos', () => {
    fredsGame.pieceLineup.length.should.equal(START_N_PIECES)
    START_N_PIECES.should.equal(50)
  })
})

describe('joinGame method', () => {
  let fredsGame, io
  let fred, jim, george, amy, clara, jill
  let games = []

  before(() => {
    [fred, jim, george, amy, clara, jill] = [fredParams, jimParams, georgeParams, amyParams, claraParams, jillParams]
      .map(params => new MockPlayer(params))
    io = null
  })

  beforeEach(() => {
    fredsGame = new Game({
      player: fred,
      roomName: 'fredsroom'
    })
  })

  it('has players fred, jim, george, amy', () => {
    fredsGame.joinGame({ io, player: jim, playerName: 'jim', roomName: 'fredsroom' })
    fredsGame.joinGame({ io, player: george, playerName: 'george', roomName: 'fredsroom' })
    fredsGame.joinGame({ io, player: amy, playerName: 'amy', roomName: 'fredsroom' })
    fredsGame.players.should.include.members([fred, george, jim, amy])
    fredsGame.players.map(p => p.playerName).should.include.members(['fred', 'george', 'jim', 'amy'])
  })

  it('has 4 players, all active, and player[0] is fred', () => {
    fredsGame.joinGame({ io, player: jim, playerName: 'jim', roomName: 'fredsroom' })
    fredsGame.joinGame({ io, player: george, playerName: 'george', roomName: 'fredsroom' })
    fredsGame.joinGame({ io, player: amy, playerName: 'amy', roomName: 'fredsroom' })
    fredsGame.players.length.should.equal(4)
    fredsGame.players[0].should.equal(fred)
    fredsGame.activePlayers.should.include.members([fred, george, jim, amy])
  })

  it('has not started', () => {
    fredsGame.inProgress.should.equal(false)
  })

  it('throws if player name is not unique', () => {
    const anotherFred = new MockPlayer({ playerName: 'fred', socketId: '200' })
    const res = (fredsGame) => fredsGame._addPlayer({ io, player: anotherFred })
    chai.expect(res.bind(res, fredsGame)).to.throw(/not unique/)
  })

  it('adds player Clara but sets to waiting if room is full', () => {
    fredsGame.joinGame({ io, player: jim, playerName: 'jim', roomName: 'fredsroom' })
    fredsGame.joinGame({ io, player: george, playerName: 'george', roomName: 'fredsroom' })
    fredsGame.joinGame({ io, player: amy, playerName: 'amy', roomName: 'fredsroom' })
    fredsGame.joinGame({ io, player: jill, playerName: 'jill', roomName: 'fredsroom' })
    const res = (fredsGame) => fredsGame.joinGame({ io, player: clara, playerName: 'clara', roomName: 'fredsroom' })
    chai.expect(res.bind(res, fredsGame)).to.not.throw()
    fredsGame.players.should.include(clara)
    fredsGame.activePlayers.should.not.include(clara)
    clara.waiting.should.equal(true)
  })

  it('adds player Clara but sets to waiting if room is in progress', () => {
    fredsGame.joinGame({ io, player: jim, playerName: 'jim', roomName: 'fredsroom' })
    fredsGame.joinGame({ io, player: george, playerName: 'george', roomName: 'fredsroom' })
    fredsGame.inProgress = true
    const res = (fredsGame) => fredsGame.joinGame({ io, player: clara, playerName: 'clara', roomName: 'fredsroom' })
    chai.expect(res.bind(res, fredsGame)).to.not.throw()
    fredsGame.players.should.include(clara)
    fredsGame.activePlayers.should.not.include(clara)
    clara.waiting.should.equal(true)
  })
})

describe('Game action', () => {
  let fredsGame, io = null
  let fred, jim, george, amy, clara, jill

  beforeEach(() => {
    [fred, jim, george, amy, clara, jill] = [fredParams, jimParams, georgeParams, amyParams, claraParams, jillParams]
      .map(params => new MockPlayer(params))
    fredsGame = new Game({
      player: fred,
      roomName: 'fredsroom'
    })
    fredsGame.joinGame({ io, player: jim, playerName: 'jim', roomName: 'fredsroom' })
    fredsGame.joinGame({ io, player: george, playerName: 'george', roomName: 'fredsroom' })
  })

  it('pieceLineup getter makes sure no player has < 10 pieces', () => {
    jim.pieceIndex = 45
    fred.pieceIndex = 9
    const nRemainingPieces = fredsGame.pieceLineup.length
    nRemainingPieces.should.equal(START_N_PIECES + N_PIECES_TO_APPEND)
  })
})
