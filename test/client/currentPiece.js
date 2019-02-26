import { assert } from 'chai'
import { configureStore } from '../helpers/client'
import rootReducer from '../../src/client/reducers'
import { getNextPiece, GET_NEXT_PIECE } from '../../src/client/actions/piece'
import { pieces } from '../../src/pieces'
import { cloneDeep } from 'lodash'
import { handlePieceLock } from '../../src/client/actions/update';
import { EMPTY_BOARD } from '../../src/client/reducers/board';

const newPiece = () => Math.floor(Math.random() * pieces.length)

const pieceLineup = new Array(10).fill(0).map(() => newPiece())
const game = {
  pieceLineup
}
const player = {
  pieceIndex: 0,
  ghost: EMPTY_BOARD
}
const currentPiece = null
const initialState = { player, game, currentPiece }

describe('Redux currentPiece test', () => {

  it('Get the next piece from lineup', done => {
    const store = configureStore(rootReducer, null, initialState, {
      GET_NEXT_PIECE: ({ getState }) => {
        const { currentPiece } = getState()
        assert.typeOf(currentPiece, 'object')
        assert.deepEqual(currentPiece, {...pieces[pieceLineup[0]], pos: [1,4]})
        done()
      }
    })
    store.dispatch(getNextPiece(pieces[pieceLineup[0]]))
  })

  // it('Get the next piece from lineup using the application state', done => {
  //   const store = configureStore(rootReducer, null, initialState, {
  //     GET_NEXT_PIECE: ({ getState }) => {
  //       const { currentPiece } = getState()
  //       assert.typeOf(currentPiece, 'object')
  //       done()
  //     }
  //   })
  //   store.dispatch(handlePieceLock(pieceLineup[0]))
  // })
})