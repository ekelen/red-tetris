import validator from 'validator';
import { cloneDeep } from 'lodash'
import { START_N_PIECES } from '../common/constants';
import { pieces } from '../pieces';

class Piece {
  constructor() {}

  static generateLineup(nPieces = START_N_PIECES) {
    const _newPiece = () => Math.floor(Math.random() * pieces.length)
    const lineup = new Array(nPieces).fill(0).map((_) => _newPiece())
    return lineup
  }
}

export default Piece