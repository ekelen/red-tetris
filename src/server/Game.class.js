import validator from 'validator';
import debug from 'debug'
import Piece from '../../src/server/Piece.class';
const logerror = debug('tetris:error'), loginfo = debug('tetris:info')

class Game {
  constructor(params) {
    if (!params.player || !params.nPlayers || !params.roomName)
      throw new Error('Missing some parameters.')

    validator.isInt(params['nPlayers'].toString(), {
      min: 2,
      max: 5
    })
    validator.isAlphanumeric(params['roomName'])
    validator.isLength(params['roomName'], {
      min: 3,
      max: 20
    })

    if (!params.player || !params.player['playerName'])
      throw new Error('Invalid lead player type.')

    this.nPlayers = params.nPlayers
    // TODO: Current nPlayers so that new players can wait for others to leave+end of game

    this.roomName = params.roomName
    this.lead = params.player
    this.players = [this.lead]
    this.inProgress = false
    this._pieceLineup = []
  }

  get playerNames() {
    return this.players.map(player => player.playerName)
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

  static createGame({ games, nPlayers, player, playerName, roomName }) {
    try {
      player.playerName = playerName
      const game = new Game({ nPlayers, player, roomName })
      games.push(game)
      player.socket.join('roomName')
      player.socket.emit('action', { type: 'CREATE_MULTIPLAYER_GAME', nPlayers, playerName, roomName })
    } catch (error) {
      player.socket.emit('action', { type: 'CREATE_GAME_ERROR', err: `Error creating game: ${error.message}` })
    }
  }

  addPlayer(player) {
    if (!player['playerName'] || !player['socket'])
      throw new Error('Invalid new player.')
    if (this._isFull()) throw new Error('Room is full.')
    if (this.playerNames.includes(player.playerName))
      throw new Error(`Username ${player.playerName} is taken.`)
    this.players.push(player)
  }

  joinGame({ io, player, playerName, roomName, nPlayers }) {
    try {
      player.playerName = playerName
      this.addPlayer(player)
      player.socket.join(roomName)
      io.in(roomName).emit('action', {
        type: 'JOIN_MULTIPLAYER_GAME',
        currNPlayers: this.players.length + 1,
        nPlayers,
        playerName: player.playerName,
        roomName
      })
    } catch (error) {
      player.socket.emit('action', { type: 'ROOM_ERROR', err: `Error joining ${roomName}: ${error.message}` })
    }
  }

  _isFull() {
    return this.players.length >= this.nPlayers
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
    io.in(this.roomName).emit('action', { type: 'PLAYER_LEFT', playerName, currNPlayers: this.players.length - 1 })
  }
}

export default Game
