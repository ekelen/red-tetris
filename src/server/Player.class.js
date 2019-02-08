import validator from 'validator';
import { cloneDeep } from 'lodash'

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
    validator.isLength(playerName, { min: 3, max: 20 })
    this._playerName = playerName
  }

  get playerName() {
    return this._playerName
  }

  destroysLine(board, roomName) { // this player clears a line
    this.board = cloneDeep(board)
    this.socket.to(roomName).emit('action', { type: 'MALUS', fromPlayer: this.playerName, ghost: this.board })
  }

  dies(roomName) {
    this.alive = false
    this.socket.to(roomName).emit('action', { type: 'OPPONENT_DIED', deadPlayerName: this.playerName })
  }

  lockPiece(board, roomName) { // update ghost
    this.board = cloneDeep(board)
    this.socket.to(roomName).emit('action', { type: 'GHOST_UPDATED', playerName: this.playerName, ghost: this.board })
  }
}

export default Player
