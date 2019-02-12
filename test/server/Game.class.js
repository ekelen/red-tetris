/* eslint-env node, mocha */
import chai from "chai"
import Game from "../../src/server/Game.class";

chai.should()

class MockPlayer {
  constructor({
    playerName,
    socketId
  }) {
    this.playerName = playerName
    this.socket = {
      id: socketId
    },
    this.ghost = new Array(20).fill(new Array(10).fill(0));
  }
}

const fred = new MockPlayer({
  playerName: 'fred',
  socketId: 1
})
const jim = new MockPlayer({
  playerName: 'jim',
  socketId: 2
})

const george = new MockPlayer({
  playerName: 'george',
  socketId: 10
})

const amy = new MockPlayer({
  playerName: 'amy',
  socketId: 11
})

const clara = new MockPlayer({
  playerName: 'clara',
  socketId: 12
})

const jane = new MockPlayer({
  playerName: 'jane',
  socketId: 13
})

describe('Game creation', () => {
  let game, player, roomName, janeParams, fredsGame

  before(() => {
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
      socketId: 13
    }
  })

  it('throws if roomName is not unique')

  it('throws if roomName is not alphanumeric', () => {
    player = jane
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
    const res = new Game({ player: jane, roomName })
    res.should.be.instanceOf(Game)
  })

  it('has 50 tetraminos', () => {
    roomName = 'janesroom'
    game = new Game({ player: jane, roomName })
    game.pieceLineup.length.should.equal(50)
  })

  it('assigns the creating player as the lead player', () => {
    roomName = 'janesroom'
    game = new Game({ player: jane, roomName })
    game.lead.playerName.should.equal('jane')
  })
})

describe('add player', () => {
  let fredsGame

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

  it('has not started', () => {
    fredsGame.inProgress.should.equal(false)
  })

  it('throws if player does not have required props of player')

  it('throws if player name is not unique', () => {
    const anotherFred = new MockPlayer({ playerName: 'fred', socketId: 2 })
    const res = (fredsGame) => fredsGame.addPlayer(anotherFred)
    chai.expect(res.bind(res, fredsGame)).to.throw(/not unique/)
  })

  it('accepts valid playername if room not full', () => {
    fredsGame.addPlayer(jim)
    fredsGame.addPlayer(george)
    fredsGame.addPlayer(amy)
    fredsGame.addPlayer(jane)
    fredsGame.players.should.include(jane)
  })

  it('rejects valid playerName if room is full', () => {
    fredsGame.addPlayer(jim)
    fredsGame.addPlayer(george)
    fredsGame.addPlayer(amy)
    fredsGame.addPlayer(jane)
    const res = (fredsGame) => fredsGame.addPlayer(clara)
    chai.expect(res.bind(res, fredsGame)).to.throw(/full/)
  })

  it('rejects valid player if game is in progress', () => {
    fredsGame.inProgress = true
    const res = (fredsGame) => fredsGame.addPlayer(clara)
    chai.expect(res.bind(res, fredsGame)).to.throw(/progress/)
  })
})
