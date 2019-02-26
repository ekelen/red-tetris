import validator from 'validator';
import { cloneDeep } from 'lodash'
import { N_PIECES_TO_APPEND } from '../common/constants';
import { EMPTY_BOARD } from '../client/reducers/board';

class Player {
  constructor(params) {
    this.ghost = cloneDeep(EMPTY_BOARD)
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

  set playerName(playerName) {
    if (
      !validator.isAlphanumeric(playerName) ||
      !validator.isLength(playerName, { min: 3, max: 20 })
    ) throw new Error('Invalid player name.')
    this._playerName = playerName
  }

  // set playerStatus({ playerName, alive, ghost, pieceIndex, waiting }) {
  //   this.playerName = playerName
  //   this.alive = alive
  //   this.ghost = ghost
  //   this.pieceIndex = pieceIndex
  //   this.waiting = waiting
  // }

  get playerStatus() {
    return ({
      playerName: this.playerName,
      alive: this.alive,
      ghost: this.ghost,
      pieceIndex: this.pieceIndex,
      waiting: this.waiting
    })
  }

  updateGhost(ghost) {
    this.ghost = cloneDeep(ghost)
  }

  dies() {
    this.alive = false
  }

  applyPenaltyLines = (nLines) => {
    const penaltyLines = Array(nLines).fill(Array(10).fill(8))
    this.ghost = [...this.ghost, ...penaltyLines].slice(nLines)
  }
}

export default Player
