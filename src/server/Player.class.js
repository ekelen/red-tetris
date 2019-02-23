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
}

export default Player
