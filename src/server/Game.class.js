import validator from 'validator'
import Piece from '../../src/server/Piece.class'
import {
  ENTER_GAME_FAIL,
  CREATE_GAME_SUCCESS,
  UPDATE_GAME, MIN_N_PIECES_REMAINING,
  MAX_ACTIVE_PLAYERS
} from '../common/constants'
import { logerror } from '.'
import { EMPTY_BOARD } from '../client/reducers/board';

class Game {
  constructor(params) {
    if (!params.player || !params.roomName || !params.player.playerName)
      throw new Error('Missing some parameters.')

    if (!validator.isAlphanumeric(params.roomName) ||
    !validator.isLength(params.roomName, {
      min: 3,
      max: 20
    }))
      throw new Error('Invalid room name.')

    this._pieceLineup = []
    this.inProgress = false
    this.players = [params.player]
    this.roomName = params.roomName
  }

  /**
   * Getters/setters
   */

  // players who aren't waiting
  get activePlayers() {
    return this.players.filter(p => !p.waiting)
  }

  get alivePlayers() {
    return this.activePlayers.filter(p => p.alive)
  }

  get pieceLineup() {
    if (!this.inProgress) return []
    const maxPieceIndex = Math.max(...this.players.map(p => p.pieceIndex))
    const piecesRemaining = this._pieceLineup.length - maxPieceIndex
    if (piecesRemaining < MIN_N_PIECES_REMAINING) {
      this._pieceLineup = [...this._pieceLineup, ...Piece.generateLineup()]
    }
    return this._pieceLineup
  }

  set pieceLineup(pieceLineup) {
    this._pieceLineup = [...pieceLineup]
  }

  get gameInfo() {
    return ({
      inProgress: this.inProgress,
      roomName: this.roomName,
      players: this.players.map(player => player.playerStatus),
      pieceLineup: this.pieceLineup
    })
  }

  /**
   * Static methods
   */

  static doesRoomExist(games, roomName) {
    return Boolean(games.find((game) => game.roomName === roomName))
  }

  static getGameFromName(games, roomName) {
    return Game.doesRoomExist(games, roomName) ?
      games.find((game) => game.roomName === roomName) :
      null
  }

  static deleteGame(games, game) {
    const gameIndex = games.findIndex(g => g === game)
    if (gameIndex > -1) games.splice(gameIndex, 1)
  }

  static createGame({ games, player, playerName, roomName }) {
    try {
      player.playerName = playerName
      const game = new Game({ player, roomName })
      if (games.length > 10) {
        logerror('too many games.')
        throw new Error('Too many games! (Sorry, server is already working too hard, please try later.)')
      }
      games.push(game)
      player.socket.join(roomName, () =>
        player.socket.emit('action', { type: CREATE_GAME_SUCCESS, ...player.playerStatus, ...game.gameInfo })
      )
    } catch (error) {
      player.socket.emit('action', { type: ENTER_GAME_FAIL, errmsg: `Error creating room: ${error.message}` })
    }
  }

  /**
   * Normal methods
   */

  joinGame({ io, player, playerName, roomName }) {
    try {
      player.playerName = playerName
      this._addPlayer({ io, player })
    } catch (error) {
      this._informPlayerOnly({
        player,
        action: {
          type: ENTER_GAME_FAIL,
          errmsg: `Error joining ${roomName}: ${error.message}`
        }
      })
    }
  }

  _addPlayer({ io, player }) {
    if (!player.playerName || !player.socket || !player.socket.id)
      throw new Error('Invalid new player.')
    if (this.players.map(p => p.playerName).includes(player.playerName))
      throw new Error(`Username ${player.playerName} is not unique.`)
    player.waiting = Boolean(this.activePlayers.length >= MAX_ACTIVE_PLAYERS || this.inProgress)
    this.players.push(player)
    player.socket.join(this.roomName, () =>
      this._informRoom({ io, action: { type: UPDATE_GAME,
        message: `Player ${player.playerName} joined!`,
        ...this.gameInfo }
      })
    )
  }

  startGame({ io, player }) {
    if (player.playerName !== this.players[0].playerName)
      return
    this.pieceLineup = Piece.generateLineup()
    this.inProgress = true
    this._informRoom({
      io,
      action: {
        type: UPDATE_GAME,
        ...this.gameInfo,
        message: 'Game has started!'
      }
    })
  }

  playerUpdates(io, player, ghost, pieceIndex) {
    player.updateGhost(ghost)
    player.pieceIndex = pieceIndex
    this._informRoom({
      io,
      action: {
        type: UPDATE_GAME,
        ...this.gameInfo
      }
    })
  }

  playerDies({ io, playerName }) {
    const player = this.activePlayers.find(player => player.playerName === playerName)
    const { roomName } = this
    player.dies({ roomName })
    if (this.alivePlayers.length <= 1)
      this._endGame(io)
    else
      this._informRoom({ io, action: { type: UPDATE_GAME, message: `Player ${playerName} is dead!`, ...this.gameInfo } })
  }

  playerDestroysLines({ io, player, nLines }) {
    this.activePlayers
      .filter(p => p.playerName !== player.playerName)
      .forEach(p => { p.applyPenaltyLines(nLines) })

    this._informRoom({
      io,
      action: {
        type: UPDATE_GAME, message: `${player.playerName} destroys ${nLines}`,
        ...this.gameInfo
      }
    })
  }

  playerLeavesGame({ io, games, player }) {
    const { playerName } = player
    this.players = this.players.filter(player => player.playerName !== playerName)
    if (!this.inProgress) {
      this._updateActivePlayers()
    }

    if (!this.players.length) {
      return Game.deleteGame(games, this)
    }

    return (this.alivePlayers.length <= 1) ?
     this._endGame(io) :
     this._informEveryoneExceptPlayer({
       player,
       action: {
         type: UPDATE_GAME,
         message: `Player ${playerName} left!`,
         ...this.gameInfo } })
  }

  _updateActivePlayers() {
    const spacesRemaining = MAX_ACTIVE_PLAYERS - this.activePlayers.length
    const waitingPlayers = this.players.filter(p => p.waiting)
    for (let i = 0; i < spacesRemaining && i < waitingPlayers.length; i += 1) {
      waitingPlayers[i].waiting = false
    }
  }

  _endGame(io) {
    this.pieceLineup = []
    this.inProgress = false

    const winner = this.activePlayers.find(p => p.alive) || null

    this._updateActivePlayers()
    this.players.forEach(p => {
      p.alive = true;
      p.pieceIndex = 0;
      p.ghost = EMPTY_BOARD;
    })

    this._informRoom({ io,
      action: { type: UPDATE_GAME, message: winner ? `Player ${winner.playerName} wins!` : 'GAME OVER',
      ...this.gameInfo } })
  }

  /**
   * Socket utils
   */

  _informRoom({ io, action }) {
    if (io && io.in)
      io.in(this.roomName).emit('action', action)
  }

  _informEveryoneExceptPlayer({ player, action }) {
    if (player && player.socket && player.socket.to && player.socket.emit &&
      action && action.type) {
      player.socket.to(this.roomName).emit('action', action)
    }
  }

  _informPlayerOnly({ player, action }) {
    if (player && player.socket && player.socket.emit &&
      action && action.type) {
      player.socket.emit('action', action)
    }
  }
}

export default Game
