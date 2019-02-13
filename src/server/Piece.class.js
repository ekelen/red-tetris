import validator from 'validator';
import { cloneDeep } from 'lodash'
import { shapes } from '../../src/shapes';

class Piece {
  constructor({ shape }) {
    this.shape = cloneDeep(shape)
  }

  static get shapes() {
    return shapes
  }

  static generateLineup(nPieces = 50) {
    const _newPiece = () => new Piece({ shape: cloneDeep(Piece.shapes[Math.floor(Math.random() * Piece.shapes.length)]) })
    const lineup = new Array(nPieces).fill(0).map((_) => _newPiece())
    return lineup
  }
}

export default Piece