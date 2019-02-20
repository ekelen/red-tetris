import validator from 'validator';
import Piece from '../../src/server/Piece.class';
import { ENTER_GAME_FAIL, CREATE_GAME_SUCCESS, UPDATE_GAME, JOIN_GAME_SUCCESS, END_GAME, START_GAME, MIN_N_PIECES_REMAINING, MAX_ACTIVE_PLAYERS } from '../common/constants';
import { logerror, loginfo } from '.';

// TODO: When game ends, add waiting players if there is room
// TODO: Async issues everywhar
// TODO: Refresh/new tab in browser issues
// TODO: So many tests

// TODO: When game ends, add waiting players if there is room
// TODO: Async issues everywhar
// TODO: Refresh/new tab in browser issues

class Game {
  constructor(params) {
    if (!params.player || !params.roomName)
      throw new Error('Missing some parameters.')

    if (!validator.isAlphanumeric(params.roomName) ||
    !validator.isLength(params.roomName, {
      min: 3,
      max: 20
    }))
      throw new Error('Invalid room name.')

    if (!params.player || !params.player.playerName)
      throw new Error('Invalid lead player type.')

    this.roomName = params.roomName
    this.players = [params.player]
    this.inProgress = false
    this._pieceLineup = []
  }

  // players who aren't waiting
  get activePlayers() {
    return this.players.filter(p => !p.waiting)
  }

  // players who aren't waiting
  get activePlayers() {
    return this.players.filter(p => !p.waiting)
  }

  get playerNames() {
    return this.players.map(player => player.playerName)
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

  joinGame({ player, playerName, roomName }) {
    try {
      player.playerName = playerName
      this._addPlayer({ player })
    } catch (error) {
      player.actionToClient({ type: ENTER_GAME_FAIL, errmsg: `Error joining ${roomName}: ${error.message}` })
    }
  }

  _addPlayer({ player }) {
    if (!player.playerName || !player.socket || !player.socket.id)
      throw new Error('Invalid new player.')
    if (this.playerNames.includes(player.playerName))
      throw new Error(`Username ${player.playerName} is not unique.`)
    player.waiting = Boolean(this.activePlayers.length >= MAX_ACTIVE_PLAYERS || this.inProgress)
    this.players.push(player)
    player.actionToClient({ type: JOIN_GAME_SUCCESS, ...player.playerStatus, ...this.gameInfo })
    player.socket.join(this.roomName, () =>
        player.actionToRoom(this.roomName,
        { type: UPDATE_GAME, message: `Player ${player.playerName} joined!`, ...this.gameInfo }
      )
    )
  }

  startGame({ io }) {
    // TODO: Other game reset stuff ?
    this.inProgress = true
    this._informRoom(io, { type: START_GAME, ...this.gameInfo })
  }

  _informRoom(io, action) {
    if (io && io.in)
      io.in(this.roomName).emit('action', action)
  }

  playerDies({ io, playerName }) {
    const player = this.activePlayers.find(player => player.playerName === playerName)
    const { roomName } = this
    player.dies({ roomName })
    if (this.activePlayers.length > 1 && this.alivePlayers.length === 1)
    {
      this.pieceLineup = []
      this.inProgress = false
      const winner = this.activePlayers.find(p => p.alive)
      // TODO: Move up waiting players
      this._informRoom(io, { type: END_GAME, message: `Player ${winner.playerName} wins!`, ...this.gameInfo })
    } else {
      player.actionToRoom(roomName, { type: UPDATE_GAME, message: `Player ${playerName} is dead!`, ...this.gameInfo })
    }
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
    const { playerNames, roomName } = this
    this.players = this.players.filter(player => player.playerName !== playerName)

    player.actionToRoom(roomName, { type: UPDATE_GAME, message: `Player ${playerName} left!`, ...this.gameInfo })
    if (this.alivePlayers.length === 1) {
      this.pieceLineup = []
      this.inProgress = false
      // TODO: Move up waiting players
      this._informRoom(io, { type: END_GAME, message: `Player ${playerNames[0]} wins!`, ...this.gameInfo })
    }

    if (!this.players.length) {
      Game.deleteGame(games, this)
    }
  }
}

export default Game
