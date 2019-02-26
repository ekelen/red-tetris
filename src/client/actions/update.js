import { pieceFall, resetPiece, movePiece, rotate, offset, getNextPiece } from './piece'
import { updateActiveBoard, pieceLand, checkLine } from './board'
import { isColliding, isPlayerDead, merge, getClearedLines, clearLines } from './physics'
import { handleEvents } from './events'
import { 
  playerDies,
  serverPlayerDies,
  serverPlayerLocksPiece,
  updatePlayerGhost,
  serverSendLinePenalities,
  serverUpdatesPlayer
} from './player'

let dropCounter = 0

export const handlePlayerDies = () => dispatch => {
  dispatch(playerDies())
  dispatch(serverPlayerDies())
}

export const handlePieceDown = () => (dispatch, getState) => {
  const { currentPiece, player } = getState()
  dispatch(pieceFall())
  const { currentPiece: pieceMaybe } = getState()
  if (isColliding(player.ghost, pieceMaybe)) {
    dispatch(resetPiece(currentPiece))
  }
  dispatch(updateActiveBoard(getState().currentPiece, player.ghost))
}

// handle events when a piece is locked: 
// update lockedBoard
// check for completed lines and clear them if necesary
// send malus to other players if necessary
// get next piece to keep playing
export const handlePieceLock = piece => (dispatch, getState) => {
  const { player } = getState()
  const updatedLockedBoard = merge(player.ghost, piece)
  const clearedLinesIndexes = getClearedLines(updatedLockedBoard)
  const updatedLockedBoardWithLinesCleared = clearLines(updatedLockedBoard, clearedLinesIndexes)
  dispatch(updatePlayerGhost(updatedLockedBoardWithLinesCleared))
  const { player: updatedPlayer, game } = getState()
  dispatch(serverSendLinePenalities(clearedLinesIndexes.length))
  dispatch(serverUpdatesPlayer(updatedPlayer))
  dispatch(resetPiece) //TODO: replace this with getNextPiece
  // dispatch(getNextPiece(game.pieces, updatedPlayer.pieceIndex))
}

//TODO: maybe test this
const handlePieceFall = (dispatch, getState) => {
  const { currentPiece: pieceBeforeFall, player } = getState()
  dispatch(pieceFall())
  const { currentPiece: fallenPiece } = getState()
  if (isColliding(player.ghost, fallenPiece)) {
    dispatch(handlePieceLock(pieceBeforeFall))
  } else {
    dispatch(updateActiveBoard(fallenPiece, player.ghost))
  }
}

export const gameUpdate = () => (dispatch, getState) => {
  const { player } = getState()
  if (isPlayerDead(player.ghost)) {
    dispatch(handlePlayerDies())
    stopGameTimer()
  } else {
    dispatch(handlePieceFall)
  }
}

const animationHandler = lastTime => (dispatch, getState) => timestamp => {
  const deltaTime = timestamp - lastTime
  dropCounter += deltaTime
  if (dropCounter >= 500) {
    dropCounter = 0
    dispatch(gameUpdate())
  }
  if (getState().player.alive) {
    requestAnimationFrame(dispatch(animationHandler(timestamp)))
  }
}

export const handleMovement = dir => (dispatch, getState) => {
  const { currentPiece: initialPiece } = getState()
  dispatch(movePiece(dir))
  const { currentPiece: pieceMaybe, player } = getState()
  if (isColliding(player.ghost, pieceMaybe)) {
    dispatch(resetPiece(initialPiece))
  }
  dispatch(updateActiveBoard(getState().currentPiece, player.ghost))
}

const rotateAndOffset = tryIndex => (dispatch, getState) => {
  if (tryIndex < 5) {
    const { currentPiece: beforeRotation, player } = getState()
    dispatch(rotate())
    dispatch(offset(tryIndex, beforeRotation.rotationIndex))
    const { currentPiece: rotatedPiece } = getState()
    if (isColliding(player.ghost, rotatedPiece)) {
      dispatch(resetPiece(beforeRotation))
      dispatch(rotateAndOffset(tryIndex + 1))
    }
  }
}

export const handleRotation = () => (dispatch, getState) => {
  dispatch(rotateAndOffset(0))
  const { currentPiece: offsetPiece, player } = getState()
  dispatch(updateActiveBoard(offsetPiece, player.ghost))
}


export const startGameTimer = () => dispatch => {
  requestAnimationFrame(dispatch(animationHandler(0)))
  window.addEventListener('keydown', dispatch(handleEvents))
}

export const stopGameTimer = () => {
  //Not working
  window.removeEventListener('keydown', handleEvents)
}