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

	connect(socket) {
		socket.join(`${this.roomName}`)
		this.io.to(`${this.roomName}`).emit('action', {type: 'TEST'});
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