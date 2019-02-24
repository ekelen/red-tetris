import { pieceFall, resetPiece, movePiece, rotate, offset } from './piece'
import { updateCurrentPiece, pieceLand, checkLine } from './board'
import { isColliding, isPlayerDead } from './physics'
import { handleEvents } from './events'
import { playerDies, serverPlayerDies } from './player'

let dropCounter = 0

export const handlePlayerDies = () => dispatch => {
  dispatch(playerDies())
  dispatch(serverPlayerDies())
}

export const handlePieceDown = () => (dispatch, getState) => {
  dropCounter = 0
  const { currentPiece, lockedBoard } = getState()
  dispatch(pieceFall())
  const { currentPiece: pieceMaybe } = getState()
  if (isColliding(lockedBoard, pieceMaybe)) {
    dispatch(resetPiece(currentPiece))
  }
  dispatch(updateCurrentPiece(getState().currentPiece, lockedBoard))
}

export const frameUpdate = () => (dispatch, getState) => {
  const { currentPiece, lockedBoard } = getState()
  if (isPlayerDead(lockedBoard)) {
    dispatch(handlePlayerDies())
    stopGameTimer()
  } else {
    dispatch(pieceFall())
    const { currentPiece: fallenPiece } = getState()
    if (isColliding(lockedBoard, fallenPiece)) {
      dispatch(pieceLand(currentPiece))
      dispatch(resetPiece())
      dispatch(checkLine())
    }
    dispatch(updateCurrentPiece(currentPiece, lockedBoard))
  }
}

const animationHandler = lastTime => (dispatch, getState) => timestamp => {
  const deltaTime = timestamp - lastTime
  dropCounter += deltaTime
  if (dropCounter >= 500) {
    dropCounter = 0
    dispatch(frameUpdate())
  }
  if (getState().player.alive) {
    requestAnimationFrame(dispatch(animationHandler(timestamp)))
  }
}

export const handleMovement = dir => (dispatch, getState) => {
  const { currentPiece: initialPiece } = getState()
  dispatch(movePiece(dir))
  const { currentPiece: pieceMaybe, lockedBoard } = getState()
  if (isColliding(lockedBoard, pieceMaybe)) {
    dispatch(resetPiece(initialPiece))
  }
  dispatch(updateCurrentPiece(getState().currentPiece, lockedBoard))
}

const rotateAndOffset = tryIndex => (dispatch, getState) => {
  if (tryIndex < 5) {
    const { currentPiece: beforeRotation, lockedBoard } = getState()
    dispatch(rotate())
    dispatch(offset(tryIndex, beforeRotation.rotationIndex))
    const { currentPiece: rotatedPiece } = getState()
    if (isColliding(lockedBoard, rotatedPiece)) {
      dispatch(resetPiece(beforeRotation))
      dispatch(rotateAndOffset(tryIndex + 1))
    }
  }
}

export const handleRotation = () => (dispatch, getState) => {
  dispatch(rotateAndOffset(0))
  const { currentPiece: offsetPiece, lockedBoard } = getState()
  dispatch(updateCurrentPiece(offsetPiece, lockedBoard))
}


export const startGameTimer = () => dispatch => {
  requestAnimationFrame(dispatch(animationHandler(0)))
  window.addEventListener('keydown', dispatch(handleEvents))
}

export const stopGameTimer = () => {
  //Not working
  window.removeEventListener('keydown', handleEvents)
}