import { pieceFall, resetPiece, movePiece, rotate, offset } from './piece'
import { updateActiveBoard, pieceLand, checkLine } from './board'
import { isColliding, isPlayerDead } from './physics'
import { handleEvents } from './events'
import { playerDies, serverPlayerDies, serverPlayerLocksPiece } from './player'

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
  dispatch(updateActiveBoard(getState().currentPiece, lockedBoard))
}

//TODO: maybe test this
const handlePieceFall = (dispatch, getState) => {
  const { currentPiece: pieceBeforeFall, lockedBoard } = getState()
  dispatch(pieceFall())
  const { currentPiece: fallenPiece } = getState()
  if (isColliding(lockedBoard, fallenPiece)) {
    dispatch(pieceLand(pieceBeforeFall))
    dispatch(resetPiece())
    dispatch(checkLine())
    const slicedBoard = getState().lockedBoard.slice(4)
    const formatedBoard = slicedBoard.map(row => row.map(e => e > 0 ? 1 : 0))
    dispatch(serverPlayerLocksPiece(formatedBoard))
  } else {
    dispatch(updateActiveBoard(fallenPiece, lockedBoard))
  }
}

export const frameUpdate = () => (dispatch, getState) => {
  const { lockedBoard } = getState()
  if (isPlayerDead(lockedBoard)) {
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
  dispatch(updateActiveBoard(getState().currentPiece, lockedBoard))
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
  dispatch(updateActiveBoard(offsetPiece, lockedBoard))
}


export const startGameTimer = () => dispatch => {
  requestAnimationFrame(dispatch(animationHandler(0)))
  window.addEventListener('keydown', dispatch(handleEvents))
}

export const stopGameTimer = () => {
  //Not working
  window.removeEventListener('keydown', handleEvents)
}