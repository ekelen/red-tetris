import chai from "chai"
import { merge, isColliding } from '../src/client/actions/physics'
import { EMPTY_BOARD } from "../src/client/actions/game"
import { cloneDeep } from 'lodash'

chai.should()

const pieceMock = {
  pos: {x: 0, y: 0},
  shape: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ]
}

describe('Physics test', () => {
  it('Merge piece with board', done => {
    const board = cloneDeep(EMPTY_BOARD)
    const piece = cloneDeep(pieceMock)
    const expected = [
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    const newBoard = merge(board, piece)
    newBoard.should.deep.equal(expected)
    done()
  }),
  it('Should collide', done => {
    const board = cloneDeep(EMPTY_BOARD)
    const piece = {...cloneDeep(pieceMock), pos: {x: 0, y: 20}}
    const colliding = isColliding(board, piece)
    colliding.should.equal(true)
    done()
  })
})