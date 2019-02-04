class Game {
	constructor(params) {
		this.io = params.io
		this.nPlayers = params.nPlayers
		this.pieces = []
		this.players = [params.playerName]
		this.roomName = params.roomName
	}

	static doesRoomExist(games, roomName) {
		return !!(games.find((game) => game instanceof Game && game.roomName === roomName))
	}

	//TODO: Room/namespace for socket
	connect(socket) {
		return true
		// TODO: Room?
		// socket.join(`${this.roomName}`)
		// this.io.to(`${this.roomName}`).emit('action', {type: 'TEST'});

		// TODO: ...Or namespace?
		// this.io.of(`/${this.roomName}`).on('connection', (socket) => {
		// 	socket.emit('action', { type: 'TEST' })
		// })
	}

	static getRoomFromName(games, roomName) {
		return Game.doesRoomExist(games, roomName) 
			? games.find((game) => game instanceof Game && game.roomName === roomName) 
			: null
	}

	addPlayer(playerName) {
		this.players.push(playerName)
	}

  isFull() {
    return this.players.length >= this.nPlayers
  }
}

export default Game