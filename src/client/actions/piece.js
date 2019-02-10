export const PIECE_FALL = 'PIECE_FALL'
export const RESET_PIECE = 'RESET_PIECE'
export const MOVE_PIECE = 'MOVE_PIECE'
export const ROTATE = 'ROTATE'

export const resetPiece = piece => {
  return { type: RESET_PIECE, piece }
}
export const pieceFall = () => ({ type: PIECE_FALL })
export const movePiece = dir => ({ type: MOVE_PIECE, dir })
export const rotate = () => ({ type: ROTATE })