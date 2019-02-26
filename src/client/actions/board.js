export const UPDATE_ACTIVE_BOARD = 'UPDATE_ACTIVE_BOARD'
export const PIECE_LAND = 'PIECE_LAND'
export const CHECK_LINES = 'CHECK_LINES'

export const updateActiveBoard = (currentPiece, lockedBoard) => ({
  type: UPDATE_ACTIVE_BOARD, currentPiece, lockedBoard
})

export const pieceLand = piece => ({
  type: PIECE_LAND, piece
})

export const checkLine = () => ({ type: CHECK_LINES })
