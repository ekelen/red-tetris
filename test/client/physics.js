import chai from "chai"
import { merge, isColliding, isPlayerDead, getClearedLines, clearLines } from '../../src/client/actions/physics'
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

describe('Clear lines', () => {
  it('getClearedLines returns row indexes who all have value > 0', () => {
    const board = cloneDeep(EMPTY_BOARD)
    board[23] = new Array(10).fill(2)
    board[22] = new Array(10).fill(2)
    board[21] = new Array(10).fill(2).map((el, i) => i % 2)
    const linesToClear = getClearedLines(board)
    linesToClear.should.have.members([22, 23]).and.have.lengthOf(2)
  })

  it('returns new board with 24 rows when lines cleared', () => {
    const board = cloneDeep(EMPTY_BOARD)
    board[23] = new Array(10).fill(2)
    board[22] = new Array(10).fill(2)
    board[21] = new Array(10).fill(2).map((el, i) => i % 2)
    const linesToClear = getClearedLines(board)
    const updatedBoard = clearLines(board, linesToClear)
    updatedBoard.length.should.equal(24)
    updatedBoard.slice(0, 22).should.eql(EMPTY_BOARD.slice(0, 22))
    updatedBoard[23].should.eql(board[21])
  })

  it('works if no lines cleared', () => {
    const board = cloneDeep(EMPTY_BOARD)
    board[23] = new Array(10).fill(2).map((el, i) => i % 2)
    board[22] = new Array(10).fill(2).map((el, i) => i % 2)
    board[21] = new Array(10).fill(2).map((el, i) => i % 2)
    const linesToClear = getClearedLines(board)
    linesToClear.should.have.members([])

    const updatedBoard = clearLines(board, linesToClear)
    updatedBoard.length.should.eql(24)
    updatedBoard.should.eql(board)
  })

  it("Should't destroy penaltie lines", () => {
    const board = cloneDeep(EMPTY_BOARD)
    board[23] = new Array(10).fill(2)
    board[22] = new Array(10).fill(2)
    const linesToClear = getClearedLines(board)

    const updatedBoard = clearLines(board, linesToClear)
    updatedBoard.length.should.eql(24)
    updatedBoard.should.eql(EMPTY_BOARD)
  })
})

// describe('penaltie lines', () => {
//   it('return the ghost with locked lines', () => {
//     const ghost = cloneDeep(EMPTY_BOARD)
//     const ghostWhithPenaltieLines = getGhostWithPenaltieLines(ghost, 3)
//     const expected = cloneDeep(EMPTY_BOARD)
//     const len = expected.length
//     expected[len - 1] = Array(10).fill(8)
//     expected[len - 2] = Array(10).fill(8)
//     expected[len - 3] = Array(10).fill(8)
//     ghostWhithPenaltieLines.should.deep.equal(expected)
//   })
// })