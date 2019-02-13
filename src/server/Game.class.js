import validator from 'validator';
import debug from 'debug'
import Piece from '../../src/server/Piece.class';
import { ENTER_GAME_FAIL, CREATE_GAME_SUCCESS, UPDATE_GAME, JOIN_GAME_SUCCESS } from '../../common/constants';
const logerror = debug('tetris:error'), loginfo = debug('tetris:info')
require('./engine.js')

const maxPlayers = 5

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

  get playerNames() {
    return this.players.map(player => player.playerName)
  }

  get nPlayers() {
    return this.players.length
  }

  get pieceLineup() {
    const remainingPieces = this._pieceLineup.length - Math.max(this.players.map(player => player.pieceIndex))
    if (remainingPieces < 10) {
      Piece.generateLineup(this._pieceLineup)
    }
    return this._pieceLineup
  }

  get gameInfo() {
    return ({
      roomName: this.roomName,
      nPlayers: this.nPlayers,
      playerNames: this.playerNames,
      players: this.players.map(player => player.playerStatus)
    })
  }

  static doesRoomExist(roomName) {
    return Boolean(__games.find((game) => game.roomName === roomName))
  }

  static getRoomFromName(roomName) {
    return Game.doesRoomExist(roomName) ?
      __games.find((game) => game.roomName === roomName) :
      null
  }

  static deleteGame(game) {
    const gameIndex = __games.findIndex(g => g === game)
    if (gameIndex > -1) __games.splice(gameIndex, 1)
  }

  static createGame({ player, playerName, roomName }) {
    try {
      player.playerName = playerName
      const game = new Game({ player, roomName })
      __games.push(game)
      player.socket.join(roomName, () => {
        return player.socket.emit('action', {
          type: CREATE_GAME_SUCCESS,
          ...game.gameInfo
        })
      })
    } catch (error) {
      player.socket.emit('action', {
        type: ENTER_GAME_FAIL,
        errmsg: `Error creating game: ${error.message}` })
    }
  }

  addPlayer(player) {
    if (!player.playerName || !player.socket || !player.socket.id)
      throw new Error('Invalid new player.')
    if (this.inProgress) throw new Error('Game is in progress, please return later.')
    if (this.nPlayers >= maxPlayers) throw new Error('Room is full.')
    if (this.playerNames.includes(player.playerName))
      throw new Error(`Username ${player.playerName} is not unique.`)
    this.players.push(player)
  }

  joinGame({ player, playerName, roomName }) {
    try {
      player.playerName = playerName
      this.addPlayer(player)

      player.socket.emit('action', {
        type: JOIN_GAME_SUCCESS,
        playerName,
        ...this.gameInfo
      })
      player.socket.join((roomName), () => {
        player.socket.to(roomName).emit('action', {
          type: UPDATE_GAME,
          message: `Player ${playerName} joined!`,
          ...this.gameInfo
        })
      })
    } catch (error) {
      player.socket.emit('action', {
        type: ENTER_GAME_FAIL,
        errmsg: `Error joining ${roomName}: ${error.message}`
      })
    }
  }

  playerDies({ playerName }) {
    const player = this.players.find(player => player.playerName === playerName)
    const { roomName } = this
    player.dies({ roomName })
    player.socket.to(roomName).emit('action', {
      type: UPDATE_GAME,
      message: `Player ${playerName} is dead!`,
      ...this.gameInfo
    })
  }

  playerDestroysLine({ playerName, ghost }) {
    const player = this.players.find(player => player.playerName === playerName)
    const { roomName } = this
    player.destroysLine({ ghost })
    player.socket.to(roomName).emit('action', {
      type: UPDATE_GAME,
      message: 'I got a malus, alas',
      ...this.gameInfo
    })
  }

  playerLocksPiece({ playerName, ghost }) {
    const player = this.players.find(player => player.playerName === playerName)
    const { roomName } = this
    player.lockPieceLine({ ghost })
    player.socket.to(roomName).emit('action', {
      type: UPDATE_GAME,
      ...this.gameInfo
    })
  }

  leaveGame({ player }) {
    const { playerName } = player
    this.players = this.players.filter(player => player.playerName !== playerName)

    player.socket.to(this.roomName).emit('action', {
      type: UPDATE_GAME,
      message: `Player ${playerName} left!`,
      ...this.gameInfo
    })

    if (!this.players.length) {
      Game.deleteGame(this)
    }
  }
}

export default Game
