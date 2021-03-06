import { pieceFall, resetPiece, movePiece, rotate, offset, getNextPiece, RESET } from './piece'
import { updateActiveBoard } from './board'
import { isColliding, isPlayerDead, merge, getClearedLines, clearLines, getPieceToLock } from './physics'
import { handleEvents } from './events'
import {
  playerDies,
  serverPlayerDies,
  updatePlayerGhost,
  serverSendLinePenalities
} from './player'
import { pieces } from '../../pieces'
import { SERVER_UPDATES_PLAYER } from '../../common/constants';

let dropCounter = 0
let eventSubscription = false

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

  if (clearedLinesIndexes.length)
    dispatch(serverSendLinePenalities(clearedLinesIndexes.length))
  const { player: updatedPlayer, game } = getState()
  dispatch({ type: SERVER_UPDATES_PLAYER, ghost: updatedPlayer.ghost, pieceIndex: updatedPlayer.pieceIndex })
  const index = game.pieceLineup[updatedPlayer.pieceIndex]
  dispatch(getNextPiece(pieces[index]))
}

export const handlePlayerDies = () => dispatch => {
  dispatch(playerDies())
  dispatch(serverPlayerDies())
}

export const handleInstantLock = () => (dispatch, getState) => {
  const { currentPiece, player } = getState()
  const pieceToLock = getPieceToLock(currentPiece, player.ghost)
  dispatch(handlePieceLock(pieceToLock))
  dispatch(updateActiveBoard(pieceToLock, player.ghost))
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
  const frameRate = 500
  dropCounter = dropCounter + deltaTime
  if (dropCounter >= frameRate) {
    dropCounter = 0
    dispatch(gameUpdate())
  }
  const { player, game } = getState()
  if (player.alive && game.inProgress) {
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
  const maxtry = 5
  if (tryIndex < maxtry) {
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

  // hack to not subscribe twice to the same event listener
  if (!eventSubscription) {
    window.addEventListener('keydown', dispatch(handleEvents))
    eventSubscription = true
  }
}

export const stopGameTimer = () => dispatch => {
  dispatch({ type: RESET })
  dropCounter = 0
}
