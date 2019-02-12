/* eslint-env node, mocha */
import chai from "chai"
import Player from "../../src/server/Player.class";

chai.should()

describe('Player properties', () => {
  const validParams = {
    socket: { id: 3 }
  }

  let playerParams = {
    ...validParams
  }

  beforeEach(() => {
    playerParams = {
      ...validParams
    }
  })

  it('makes new players alive by default', () => {
    const res = new Player(playerParams)
    res.alive.should.be.true
  })

  it('instantiates a player without a name', () => {
    const res = new Player(playerParams)
    res.playerName.should.be.empty
  })

  it('does not instantiate a player without a socket with id', () => {
    playerParams.socket = null
    const res = (playerParams) => new Player(playerParams)
    chai.expect(res.bind(res, playerParams)).to.throw(/socket/i)
  })

  it('makes socket id accessible with id getter [ get id() ]', () => {
    const res = new Player(playerParams)
    res.id.should.equal(res.socket.id)
  })

  it('playerName setter throws if name too short', () => {
    const player = new Player(playerParams)
    const res = (player) => player.playerName = '42'
    chai.expect(res.bind(res, player)).to.throw(/name/i)
  })

  it('playerName setter throws if name not alphanumeric', () => {
    const player = new Player(playerParams)
    const res = (player) => player.playerName = '!@#$'
    chai.expect(res.bind(res, player)).to.throw(/name/i)
  })

  it('updates player name if valid param given to playerName setter', () => {
    const player = new Player(playerParams)
    const validName = 'jane42'
    player.playerName = validName
    player.playerName.should.equal(validName)
  })
})
