import validator from 'validator';
import debug from 'debug'
import Piece from '../../src/server/Piece.class';
const logerror = debug('tetris:error'), loginfo = debug('tetris:info')

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
    this.lead = params.player
    this.players = [this.lead]
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
    if (this._pieceLineup.length < 10) {
      Piece.generateLineup(this._pieceLineup)
    }
    return this._pieceLineup
  }

  static doesRoomExist(games, roomName) {
    return Boolean(games.find((game) => game instanceof Game && game.roomName === roomName))
  }

  static getRoomFromName(games, roomName) {
    return Game.doesRoomExist(games, roomName) ?
      games.find((game) => game instanceof Game && game.roomName === roomName) :
      null
  }

  static createGame({ games, player, playerName, roomName }) {
    try {
      player.playerName = playerName
      const game = new Game({ player, roomName })
      games.push(game)
      player.socket.join('roomName')
      player.socket.emit('action', { type: 'CREATE_GAME', playerName, roomName })
    } catch (error) {
      player.socket.emit('action', { type: 'CREATE_GAME_ERROR', err: `Error creating game: ${error.message}` })
    }
  }

  addPlayer(player) {
    if (!player.playerName || !player.socket || !player.socket.id)
      throw new Error('Invalid new player.')
    if (this.nPlayers >= maxPlayers) throw new Error('Room is full.')
    if (this.playerNames.includes(player.playerName))
      throw new Error(`Username ${player.playerName} is not unique.`)
    this.players.push(player)
  }

  joinGame({ io, player, playerName, roomName }) {
    try {
      player.playerName = playerName
      this.addPlayer(player)
      player.socket.join(roomName)
      io.in(roomName).emit('action', {
        type: 'JOIN_GAME',
        nPlayers: this.nPlayers,
        playerName: player.playerName,
        roomName
      })
    } catch (error) {
      player.socket.emit('action', { type: 'ROOM_ERROR', err: `Error joining ${roomName}: ${error.message}` })
    }
  }

  leaveGame(games, io, playerName) {
    // already checked if player in game
    this.players = this.players.filter(player => player.playerName !== playerName)

    if (!this.players.length) {
      const gameIndex = games.findIndex(game => game === this)
      games.splice(gameIndex, 1)
      return
    }

    if (this.lead.playerName === playerName) {
      this.lead = this.players[0]
      io.in(this.roomName).emit('action', { type: 'LEAD_PLAYER_CHANGED', playerName })
    }
    io.in(this.roomName).emit('action', { type: 'PLAYER_LEFT', playerName, nPlayers: this.nPlayers })
  }
}

export default Game
