export const PIECE_FALL = 'PIECE_FALL'
export const RESET_PIECE = 'RESET_PIECE'
export const MOVE_PIECE = 'MOVE_PIECE'
export const ROTATE = 'ROTATE'
export const OFFSET = 'OFFSET'
export const GET_NEXT_PIECE = 'GET_NEXT_PIECE'
export const RESET = 'RESET'

export const resetPiece = piece => ({
  type: RESET_PIECE, piece
})
export const pieceFall = () => ({ type: PIECE_FALL })
export const movePiece = dir => ({ type: MOVE_PIECE, dir })
export const rotate = () => ({ type: ROTATE })
export const offset = (tryIndex, fromIndex) => ({ type: OFFSET, tryIndex, fromIndex })
export const getNextPiece = nextPiece => ({
  type: GET_NEXT_PIECE,
  nextPiece
})
