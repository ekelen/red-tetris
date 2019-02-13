import validator from 'validator';
import { cloneDeep } from 'lodash'
import debug from 'debug'
const logerror = debug('tetris:error'), loginfo = debug('tetris:info')

class Player {
  constructor(params) {
    this.board = [
      []
    ] // TODO: Get rid of
    this.ghost = new Array(20).fill(0).map((_) => new Array(10).fill(0))
    this.alive = true
    this.pieceIndex = 0
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
      pieceIndex: this.pieceIndex
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
