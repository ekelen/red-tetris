import validator from 'validator';
import { cloneDeep } from 'lodash'

class Player {
  constructor(params) {
    this.board = [
      []
    ]
    this.ghost = new Array(20).fill(0).map((_) => new Array(10).fill(0))
    this.alive = true
    this._playerName = ''

    // if (!params.socket || !params.socket instanceof Socket) throw 'Invalid socket.'
    if (!params.socket || !params.socket.id) throw new Error('Invalid socket.')
    this.socket = params.socket
  }

  get id() {
    return this.socket.id || 0
  }

  set playerName(playerName) {
    if (
      !validator.isAlphanumeric(playerName) ||
      !validator.isLength(playerName, { min: 3, max: 20 })
    ) throw new Error('Invalid player name.')
    this._playerName = playerName
  }

  get playerName() {
    return this._playerName
  }

  destroysLine(board, roomName) { // this player clears a line
    this.board = cloneDeep(board)
    this.socket.to(roomName).emit('action', { type: 'OPPONENT_GIVES_MALUS', fromPlayer: this.playerName, ghost: this.board })
  }

  dies(roomName) {
    this.alive = false
    this.socket.to(roomName).emit('action', { type: 'OPPONENT_DIES', deadPlayerName: this.playerName })
  }

  lockPiece(board, roomName) { // update ghost
    this.board = cloneDeep(board)
    this.socket.to(roomName).emit('action', { type: 'OPPONENT_GHOST_UPDATED', playerName: this.playerName, ghost: this.board })
  }
}

export default Player
