export const UPDATE_CURRENT_PIECE = 'UPDATE_CURRENT_PIECE'
export const PIECE_LAND = 'PIECE_LAND'

export const updateCurrentPiece = (currentPiece, lockedBoard) => {
  return { type: UPDATE_CURRENT_PIECE, currentPiece, lockedBoard }
}

export const pieceLand = piece => {
  return ({type: PIECE_LAND, piece})
}