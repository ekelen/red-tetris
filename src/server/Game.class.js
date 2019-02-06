import validator from 'validator';

class Game {
	constructor(params) {
		validator.isInt(params['nPlayers'].toString(), { min: 2, max: 5 })
		validator.isAlphanumeric(params['playerName'])
		validator.isLength(params['playerName'], {min: 3, max: 20})
		validator.isAlphanumeric(params['roomName'])
		validator.isLength(params['roomName'], {min: 3, max: 20})

		this.nPlayers = params.nPlayers
		this.pieces = []
		this.players = [params.playerName]
		this.roomName = params.roomName
	}

	static doesRoomExist(games, roomName) {
		return !!(games.find((game) => game instanceof Game && game.roomName === roomName))
	}

	static getRoomFromName(games, roomName) {
		return Game.doesRoomExist(games, roomName) 
			? games.find((game) => game instanceof Game && game.roomName === roomName) 
			: null
	}

	connect(io, socket) {
		socket.join(`${this.roomName}`)
		io.to(`${this.roomName}`).emit('action', {type: 'TEST'});
	}

	addPlayer(playerName) {
		validator.isAlphanumeric(playerName)
		validator.isLength(playerName, {min: 3, max: 20})

		if (this._isFull())
			throw 'Room is full.'
		if (this.players.includes(playerName))
			throw `Username ${playerName} is taken.`
		this.players.push(playerName)
	}

  _isFull() {
    return this.players.length >= this.nPlayers
  }
}

export default Game