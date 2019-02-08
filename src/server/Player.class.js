import validator from 'validator';

class Player {
  constructor(params) {
    this.board = [
      []
    ]
    this.alive = true
    this._playerName = ''

    // if (!params.socket || !params.socket instanceof Socket) throw 'Invalid socket.'
    this.socket = params.socket
  }

  get id() {
    return this.socket.id || 0
  }

  set playerName(playerName) {
    validator.isAlphanumeric(playerName)
    validator.isLength(playerName, {
      min: 3,
      max: 20
    })
    this._playerName = playerName
  }

  get playerName() {
    return this._playerName
  }

  destroysLine() {
    // emit malus to room
  }

  dies() {
    this.alive = false
    // emit death to room
  }
}

export default Player
