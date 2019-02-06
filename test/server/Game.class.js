import chai from "chai"
import Game from "../../src/server/Game.class";

chai.should()

const mockGame1 = new Game({playerName: 'fred', roomName: 'room1', nPlayers: 3})
mockGame1.addPlayer('jim')

const games = [mockGame1]

describe('Game constructor', () => {
  const validParams = { nPlayers: 2, roomName: 'room', playerName: 'coolPlayer1' }
  let gameParams = { ...validParams }

  beforeEach(() => {
    gameParams = { ...validParams }
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

  it('throws if playerName is not alphanumeric', () => {
    gameParams.playerName = '!@#$'
    const res = (gameParams) => new Game(gameParams)
    res.should.throw()
  })

  it('creates a new game with valid params', () => {
    const res = new Game(gameParams)
    res.should.be.instanceOf(Game)
  })
})

describe('Join game', () => {
  it('throws if player has invalid name', () => {
    const game = games[0]
    const res = (game) => game.addPlayer('!@#$%')
    res.should.throw()
  })

  it('throws if player name is not unique', () => {
    const game = games[0]
    const res = (game) => game.addPlayer('jim')
    res.should.throw()
  })

  it('accepts valid playername if room not full', () => {
    const game = games[0]
    game.addPlayer('carly')
    const res = game.players
    res.should.include('carly')
  })

  it('rejects valid playerName if room is full', () => {
    const game = games[0]
    const res = (game) => game.addPlayer('maria')
    res.should.throw()
  })
})