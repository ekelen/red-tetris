import validator from 'validator';
import Piece from '../../src/server/Piece.class';
import { ENTER_GAME_FAIL, CREATE_GAME_SUCCESS, UPDATE_GAME, MIN_N_PIECES_REMAINING, MAX_ACTIVE_PLAYERS } from '../common/constants';
import { logerror, loginfo } from '.';

// TODO: So many tests
// TODO: Async issues everywhar

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

  // players who aren't waiting
  get activePlayers() {
    return this.players.filter(p => !p.waiting)
  }

  get alivePlayers() {
    return this.activePlayers.filter(p => p.alive)
  }

  get pieceLineup() {
    if (!this._pieceLineup.length)
      this._pieceLineup = Piece.generateLineup()
    const maxPieceIndex = Math.max(...this.players.map(p => p.pieceIndex))
    const piecesRemaining = this._pieceLineup.length - maxPieceIndex
    if (piecesRemaining < MIN_N_PIECES_REMAINING) {
      this._pieceLineup = [...this._pieceLineup, ...Piece.generateLineup()]
    }
    return this._pieceLineup
  }

  set pieceLineup(pieces) {
    this._pieceLineup = [...pieces]
  }

  get gameInfo() {
    return ({
      inProgress: this.inProgress,
      roomName: this.roomName,
      players: this.players.map(player => player.playerStatus),
      pieceLineup: this.pieceLineup
    })
  }

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
      games.push(game)
      player.socket.join(roomName, () =>
        player.actionToClient({ type: CREATE_GAME_SUCCESS, ...player.playerStatus, ...game.gameInfo }))
    } catch (error) {
      player.actionToClient({ type: ENTER_GAME_FAIL, errmsg: `Error creating room: ${error.message}` })
    }
  }

  joinGame({ io, player, playerName, roomName }) {
    try {
      player.playerName = playerName
      this._addPlayer({ io, player })
    } catch (error) {
      player.actionToClient({ type: ENTER_GAME_FAIL, errmsg: `Error joining ${roomName}: ${error.message}` })
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
        this._informRoom(io, { type: UPDATE_GAME,
          message: `Player ${player.playerName} joined!`,
          ...this.gameInfo }
      )
    )
  }

  startGame({ io, player }) {
    if (player.playerName !== this.players[0].playerName)
      return
    this.inProgress = true
    this._informRoom(io, { type: UPDATE_GAME, ...this.gameInfo, message: 'Game has started!' })
  }

  _informRoom(io, action) {
    if (io && io.in)
      io.in(this.roomName).emit('action', action)
  }

  playerDies({ io, playerName }) {
    const player = this.activePlayers.find(player => player.playerName === playerName)
    const { roomName } = this
    player.dies({ roomName })
    if (this.alivePlayers.length <= 1)
      this._endGame(io)
    else
      this._informRoom(io, { type: UPDATE_GAME, message: `Player ${playerName} is dead!`, ...this.gameInfo })
  }

  playerDestroysLine({ playerName, ghost }) {
    const player = this.activePlayers.find(player => player.playerName === playerName)
    const { roomName } = this
    player.destroysLine({ ghost })
    player.actionToRoom({ roomName, action: { type: UPDATE_GAME, message: 'I got a malus, alas',
      ...this.gameInfo
      }
    })
  }

  playerLocksPiece({ playerName, ghost }) {
    const player = this.activePlayers.find(player => player.playerName === playerName)
    const { roomName } = this
    player.lockPieceLine({ ghost })
    player.actionToRoom(roomName, { type: UPDATE_GAME, ...this.gameInfo })
  }

  playerLeavesGame({ io, games, player }) {
    const { playerName } = player
    this.players = this.players.filter(player => player.playerName !== playerName)

    if (!this.players.length) {
      return Game.deleteGame(games, this)
    }

    return (this.alivePlayers.length === 1) ?
     this._endGame(io) :
      player.actionToRoom(this.roomName, { type: UPDATE_GAME, message: `Player ${playerName} left!`, ...this.gameInfo })
  }

  _endGame(io) {
    this.pieceLineup = []
    this.inProgress = false

    const winner = this.activePlayers.find(p => p.alive)

    const spacesRemaining = MAX_ACTIVE_PLAYERS - this.activePlayers.length
    const waitingPlayers = this.players.filter(p => p.waiting)
    for (let i = 0; i < spacesRemaining && i < waitingPlayers.length; i += 1) {
      waitingPlayers[i].waiting = false
    }
    this.players.forEach(p => {
      p.alive = true;
      p.pieceIndex = 0;
      p.ghost = new Array(20).fill(0).map((_) => new Array(10).fill(0))
    })
    this._informRoom(io, { type: UPDATE_GAME, message: `Player ${winner.playerName} wins!`, ...this.gameInfo })
  }
}

export default Game
