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
    }
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

const mockGame1 = new Game({
  player: fred,
  roomName: 'fredsroom',
  nPlayers: 3
})
mockGame1.addPlayer(jim)

const games = [mockGame1]

describe('Game constructor', () => {
  const validJane = new MockPlayer({
    playerName: 'jane',
    socketId: 3
  })

  const validParams = {
    nPlayers: 2,
    roomName: 'janesroom',
    player: validJane
  }

  let gameParams = {
    ...validParams
  }

  beforeEach(() => {
    gameParams = {
      ...validParams
    }
  })

  it('number of players must be between 2 and 5 inclusive', () => {
    gameParams.nPlayers = 6
    const res = (gameParams) => new Game(gameParams)
    res.should.throw()
  })

  it('throws if roomName is not alphanumeric', () => {
    gameParams.roomName = '!@#$'
    const res = (gameParams) => new Game(gameParams)
    res.should.throw()
  })

  it('throws if player has no name', () => {
    gameParams.player = new MockPlayer({
      playerName: null,
      socket: validJane.socket
    })
    const res = (gameParams) => new Game(gameParams)
    res.should.throw()
  })

  it('creates a new game with valid params', () => {
    const res = new Game(gameParams)
    res.should.be.instanceOf(Game)
  })
})

describe('Join game', () => {
  const validJane = new MockPlayer({
    playerName: 'jane',
    socketId: 3
  })

  it('throws if player has invalid name')

  it('throws if player name is not unique', () => {
    const game = games[0]
    const res = (game) => game.addPlayer(validJane)
    res.should.throw()
  })

  it('accepts valid playername if room not full', () => {
    const game = games[0]
    game.addPlayer(new MockPlayer({
      playerName: 'carly',
      socket: {
        id: 5
      }
    }))

    const res = game.playerNames
    res.should.include('carly')
  })

  it('rejects valid playerName if room is full', () => {
    const game = games[0]
    const res = (game) => game.addPlayer(new MockPlayer({
      playerName: 'maria',
      socket: {
        id: 6
      }
    }))
    res.should.throw()
  })
})
