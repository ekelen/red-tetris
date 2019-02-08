import validator from 'validator';

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

    // TODO: Too annoying when testing, find another solution to make sure player is valid if even necessary

    // if (!params.player || !params.player instanceof Player) {
    // 	throw 'Invalid lead player type.'
    // }
    if (!params.player || !params.player['playerName'])
      throw new Error('Invalid lead player type.')

    this.nPlayers = params.nPlayers
    this.pieces = []

    this.roomName = params.roomName
    this.lead = params.player
    this.players = [this.lead]
  }

  get playerNames() {
    return this.players.map(player => player.playerName)
  }

  static doesRoomExist(games, roomName) {
    return Boolean(games.find((game) => game instanceof Game && game.roomName === roomName))
  }

  static getRoomFromName(games, roomName) {
    return Game.doesRoomExist(games, roomName) ?
      games.find((game) => game instanceof Game && game.roomName === roomName) :
      null
  }

  addPlayer(player) {
    // TODO: Too annoying when testing
    // if (!player instanceof Player || !player['playerName']) throw 'Invalid new player.'

    if (!player['playerName'] || !player['socket'])
      throw new Error('Invalid new player.')

    if (this._isFull()) throw new Error('Room is full.')
    if (this.playerNames.includes(player.playerName))
      throw new Error(`Username ${player.playerName} is taken.`)
    this.players.push(player)
  }

  _isFull() {
    return this.players.length >= this.nPlayers
  }
}

export default Game
