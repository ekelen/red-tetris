/* eslint-env node, mocha */
import chai from "chai"
import Player from "../../src/server/Player.class";
import { EMPTY_BOARD } from "../../src/client/reducers/board";
import { cloneDeep } from 'lodash'

chai.should()

describe('Player properties', () => {
  const validParams = {
    socket: { id: '3sdf' }
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
    const player = new Player(playerParams)
    const id = player.id
    id.should.equal(player.socket.id).and.be.a('string')
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

  it('player starts at pieceIndex 0', () => {
    const player = new Player(playerParams)
    player.pieceIndex.should.equal(0)
  })

  it('playerStatus getter should return alive, ghost, pieceIndex, playerName, waiting', () => {
    const player = new Player(playerParams)
    const playerStatus = player.playerStatus
    playerStatus.should.have.all.keys('alive', 'ghost', 'playerName', 'pieceIndex', 'waiting')
  })

  it('has a dies method', () => {
    chai.expect(new Player(playerParams)).to.respondTo('dies')
  })

  it('has a dies method that sets alive to false')

  it('Updates the player status with new informations', () => {
    const player = new Player(playerParams)
    const newStatus = {
      playerName: 'jean',
      alive: true,
      ghost: EMPTY_BOARD,
      pieceIndex: 0,
      waiting: false
    }
    player.playerStatus = newStatus
    player.playerStatus.should.deep.equal(newStatus)
  })

})

describe('player.applyPenaltyLines', () => {
  it('return the ghost with locked lines', () => {
    const player = new Player({ socket: { id: '123' }} )
    player.applyPenaltyLines(3)
    const expected = cloneDeep(EMPTY_BOARD)
    const len = expected.length
    expected[len - 1] = Array(10).fill(8)
    expected[len - 2] = Array(10).fill(8)
    expected[len - 3] = Array(10).fill(8)
    player.ghost.should.deep.equal(expected)
  })
})
