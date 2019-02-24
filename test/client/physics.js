import chai from "chai"
import { merge, isColliding, checkclearedLines, rotate, isPlayerDead } from '../../src/client/actions/physics'
import { EMPTY_BOARD } from "../../src/client/reducers/board"
import { cloneDeep } from 'lodash'

chai.should()

const shape = [
  [0,-1],[0,0],[0,1],[0,2] //Array of vectors
]

describe('Physics test', () => {
  it('Merge piece with board', done => {
    const board = cloneDeep(EMPTY_BOARD)
    const piece = cloneDeep({
      shape,
      color: 1,
      pos: [0, 1]
    })
    const expected = [
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
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
    const board = EMPTY_BOARD
    const piece = {shape, pos: [24, 5]}
    const colliding = isColliding(board, piece)
    colliding.should.equal(true)
    done()
  }),
  it('Should collide with right border', done => {
    const board = EMPTY_BOARD
    const piece = {shape, pos: [5, 12]}
    const colliding = isColliding(board, piece)
    colliding.should.equal(true)
    done()
  }),
  it('Should collide with left border', done => {
    const board = EMPTY_BOARD
    const piece = {shape, pos: [5, 0]}
    const colliding = isColliding(board, piece)
    colliding.should.equal(true)
    done()
  }),
  it ('Should not collide', done => {
    const board = EMPTY_BOARD
    const piece = {shape, pos: [10, 5]}
    const colliding = isColliding(board, piece)
    colliding.should.equal(false)
    done()
  }),
  it ('Should notify that player died', done => {
    const board = EMPTY_BOARD.map(() => 1)
    const dead = isPlayerDead(board)
    dead.should.equal(true)
    done()
  }),
  it ('Shouldn\'t notify that player died', done => {
    const board = EMPTY_BOARD
    const dead = isPlayerDead(board)
    dead.should.equal(false)
    done()
  })
})