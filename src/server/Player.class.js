import validator from 'validator';
import { cloneDeep } from 'lodash'
import { N_PIECES_TO_APPEND } from '../common/constants';

class Player {
  constructor(params) {
    this.ghost = new Array(20).fill(0).map((_) => new Array(10).fill(0))
    this.alive = true
    this.pieceIndex = 0
    this.waiting = false
    this._playerName = ''

    // if (!params.socket || !params.socket instanceof Socket) throw 'Invalid socket.'
    if (!params.socket || !params.socket.id) throw new Error('Invalid socket.')
    this.socket = params.socket
  }

  get id() {
    return this.socket.id || ''
  }

  get playerName() {
    return this._playerName
  }

  get nRemainingPieces() {
    return this.pieceIndex > 0 ?
      N_PIECES_TO_APPEND - (this.pieceIndex % N_PIECES_TO_APPEND) :
        N_PIECES_TO_APPEND
  }

  set playerName(playerName) {
    if (
      !validator.isAlphanumeric(playerName) ||
      !validator.isLength(playerName, { min: 3, max: 20 })
    ) throw new Error('Invalid player name.')
    this._playerName = playerName
  }

  get playerStatus() {
    return ({
      playerName: this.playerName,
      alive: this.alive,
      ghost: this.ghost,
      pieceIndex: this.pieceIndex,
      waiting: this.waiting
    })
  }

  resetPlayer() {
    this.pieceIndex = 0
    this.ghost = new Array(20).fill(0).map((_) => new Array(10).fill(0))
  }

  destroysLine({ ghost }) { // TODO: Possibly redundant with lockPiece
    this.ghost = cloneDeep(ghost)
  }

  dies({ ghost }) {
    this.alive = false
    this.ghost = cloneDeep(ghost)
  }

  lockPiece({ ghost }) {
    this.ghost = cloneDeep(ghost)
    this.pieceIndex++
  }

  // TODO: Decide if keeping
  actionToRoom(roomName, action) {
    // console.log('action: ', action);
    if (this.socket.emit && this.socket.to)
      this.socket.to(roomName).emit('action', action)
  }

  // TODO: Maybe a dumb abstraction, was trying to keep socket.emit out of Game class
  actionToClient(action) {
    if (this.socket.emit)
      this.socket.emit('action', action)
  }
}

export default Player
