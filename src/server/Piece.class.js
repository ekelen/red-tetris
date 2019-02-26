import validator from 'validator';
import { cloneDeep } from 'lodash'
import { START_N_PIECES } from '../common/constants';
import { pieces } from '../pieces';

class Piece {
  constructor() {}

  static generateLineup(nPieces = START_N_PIECES) {
    const _getIndex = () => Math.floor(Math.random() * pieces.length)
    const lineup = new Array(nPieces).fill(0).map(() => _getIndex())
    return lineup
  }
}

export default Piece
