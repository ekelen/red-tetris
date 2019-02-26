import { assert } from 'chai'
import { configureStore } from '../helpers/client'
import rootReducer from '../../src/client/reducers'
import { getNextPiece, GET_NEXT_PIECE } from '../../src/client/actions/piece'
import { pieces } from '../../src/pieces'
import { cloneDeep } from 'lodash'
import { handlePieceLock } from '../../src/client/actions/update';
import { EMPTY_BOARD } from '../../src/client/reducers/board';

const newPiece = () => ({
  ...cloneDeep(pieces[Math.floor(Math.random() * pieces.length)]),
  pos: [2, 4]
})
const piecesLineup = new Array(10).fill(0).map(() => newPiece())
const game = {
  pieces: piecesLineup
}
const player = {
  pieceIndex: 0,
  ghost: EMPTY_BOARD
}
const currentPiece = null
const initialState = {player, game, currentPiece}

describe('Redux currentPiece test', () => {
  it('Get the next piece from lineup', done => {
    const store = configureStore(rootReducer, null, initialState, {
      GET_NEXT_PIECE: ({getState}) => {
        const { currentPiece } = getState()
        assert.typeOf(currentPiece, 'object')
        assert.deepEqual(currentPiece, pieces[0])
        done()
      }
    })
    store.dispatch(getNextPiece(pieces, 0))
  })
  // it('Get the next piece from lineup using the application state', done => {
  //   const store = configureStore(rootReducer, null, initialState, {
  //     GET_NEXT_PIECE: ({getState}) => {
  //       const { currentPiece } = getState()
  //       assert.typeOf(currentPiece, 'object')
  //       done()
  //     }
  //   })
  //   store.dispatch(handlePieceLock(pieces[0]))
  // })
})