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

  static generateLineup(currentLineup = [], nPieces = 50) {
    for (let i = 0; i < nPieces; i++) {
      currentLineup.push(new Piece({ shape: cloneDeep(Piece.shapes[Math.floor(Math.random() * nPieces.length)]) }))
    }
  }
}

export default Piece