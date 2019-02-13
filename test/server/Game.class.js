/* eslint-env node, mocha */
import chai from "chai"
import Game from "../../src/server/Game.class";
import { START_N_PIECES, N_PIECES_TO_APPEND } from '../../common/constants';

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
      id: socketId
    }
    this.ghost = new Array(20).fill(new Array(10).fill(0))
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

describe('Game creation', () => {
  let game, player, roomName, janeParams, fredsGame
  let fred, jim, george, amy, clara, jill

  before(() => {
    [fred, jim, george, amy, clara, jill] = [fredParams, jimParams, georgeParams, amyParams, claraParams, jillParams]
      .map(params => new MockPlayer(params))
    fredsGame = new Game({
      player: fred,
      roomName: 'fredsroom'
    })
  })

  beforeEach(() => {
    roomName = ''
    player = null
    game = null

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
    player = new MockPlayer(janeParams)
    roomName = '!@#$'
    const res = (player, roomName) => new Game({ player, roomName })
    chai.expect(res.bind(res, player, roomName)).to.throw(/room/i)
  })

  it('throws if player has no name', () => {
    janeParams.playerName = ''
    player = new MockPlayer(janeParams)
    roomName = 'janesroom'
    const res = (player, roomName) => new Game({ player, roomName })
    chai.expect(res.bind(res, player, roomName)).to.throw(/invalid/i)
  })

  it('creates a new game with valid params', () => {
    roomName = 'janesroom'
    player = new MockPlayer(janeParams)
    const res = new Game({ player, roomName })
    res.should.be.instanceOf(Game)
  })

  it('has 50 (START_N_PIECES) tetraminos', () => {
    fredsGame.pieceLineup.length.should.equal(START_N_PIECES).and.equal(50)
  })
})

describe('add player', () => {
  let fredsGame
  let fred, jim, george, amy, clara, jill

  before(() => {
    [fred, jim, george, amy, clara, jill] = [fredParams, jimParams, georgeParams, amyParams, claraParams, jillParams]
      .map(params => new MockPlayer(params))
  })

  beforeEach(() => {
    fredsGame = new Game({
      player: fred,
      roomName: 'fredsroom'
    })
  })

  it('has players fred, jim, george, amy', () => {
    fredsGame.addPlayer(jim)
    fredsGame.addPlayer(george)
    fredsGame.addPlayer(amy)
    fredsGame.playerNames.should.include.members(['fred', 'george', 'jim', 'amy'])
  })

  it('has 4 players', () => {
    fredsGame.addPlayer(jim)
    fredsGame.addPlayer(george)
    fredsGame.addPlayer(amy)
    fredsGame.nPlayers.should.equal(4)
  })

  it('has 4 players but fred still is at index 0', () => {
    fredsGame.addPlayer(jim)
    fredsGame.addPlayer(george)
    fredsGame.addPlayer(amy)
    fredsGame.playerNames[0].should.equal('fred')
  })

  it('has not started', () => {
    fredsGame.inProgress.should.equal(false)
  })

  it('throws if player name is not unique', () => {
    const anotherFred = new MockPlayer({ playerName: 'fred', socketId: '200' })
    const res = (fredsGame) => fredsGame.addPlayer(anotherFred)
    chai.expect(res.bind(res, fredsGame)).to.throw(/not unique/)
  })

  it('accepts valid playername if room not full', () => {
    fredsGame.addPlayer(jim)
    fredsGame.addPlayer(george)
    fredsGame.addPlayer(amy)
    fredsGame.addPlayer(jill)
    fredsGame.players.should.include(jill)
  })

  it('rejects valid playerName if room is full', () => {
    fredsGame.addPlayer(jim)
    fredsGame.addPlayer(george)
    fredsGame.addPlayer(amy)
    fredsGame.addPlayer(jill)
    const res = (fredsGame) => fredsGame.addPlayer(clara)
    chai.expect(res.bind(res, fredsGame)).to.throw(/full/)
  })

  it('rejects valid player if game is in progress', () => {
    fredsGame.inProgress = true
    const res = (fredsGame) => fredsGame.addPlayer(clara)
    chai.expect(res.bind(res, fredsGame)).to.throw(/progress/)
  })
})

describe('Game action', () => {
  let game, player, roomName, fredsGame
  let fred, jim, george, amy, clara, jill

  beforeEach(() => {
    [fred, jim, george, amy, clara, jill] = [fredParams, jimParams, georgeParams, amyParams, claraParams, jillParams]
      .map(params => new MockPlayer(params))
    fredsGame = new Game({
      player: fred,
      roomName: 'fredsroom'
    })
    fredsGame.addPlayer(jim)
    fredsGame.addPlayer(george)
  })

  it('has 50 pieces at the beginning', () => {
    const nRemainingPieces = fredsGame.pieceLineup.length
    nRemainingPieces.should.equal(START_N_PIECES)
  })

  it('get pieceLineup: uses player with highest piece index to get more pieces', () => {
    jim.pieceIndex = 45
    fred.pieceIndex = 9
    const nRemainingPieces = fredsGame.pieceLineup.length
    nRemainingPieces.should.equal(START_N_PIECES + N_PIECES_TO_APPEND)
  })
})
