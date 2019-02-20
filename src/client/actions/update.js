import { pieceFall, resetPiece, movePiece, rotate } from './piece'
import { updateCurrentPiece, pieceLand, checkLine } from './board'
import { isColliding } from './physics'
const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40

let dropCounter = 0 //TODO: Put that in a state ?

//TODO: find a way to test this
const pieceDown = () => (dispatch, getState) => {
  dropCounter = 0
  const { currentPiece, lockedBoard } = getState()
  dispatch(pieceFall())
  const { currentPiece: pieceMaybe } = getState()
  if (isColliding(lockedBoard, pieceMaybe)) {
    dispatch(resetPiece(currentPiece))
  }
  dispatch(updateCurrentPiece(getState().currentPiece, lockedBoard))
}

const update = () => (dispatch, getState) => {
  const { currentPiece, lockedBoard } = getState()
  dispatch(pieceFall())
  const { currentPiece: pieceMaybe } = getState()
  if (isColliding(lockedBoard, pieceMaybe)) {
    dispatch(pieceLand(currentPiece))
    dispatch(resetPiece())
    dispatch(checkLine())
  }
  dispatch(updateCurrentPiece(currentPiece, lockedBoard))
}

const animationHandler = (dispatch, lastTime) => timestamp => {
  const deltaTime = timestamp - lastTime
  dropCounter += deltaTime
  if (dropCounter >= 500) {
    dropCounter = 0
    dispatch(update())
  }
  requestAnimationFrame(animationHandler(dispatch, timestamp))
}

//TODO: find a way to test this
const move = dir => (dispatch, getState) => {
  const { currentPiece } = getState() //TODO: use for the reset
  dispatch(movePiece(dir))
  const { currentPiece: pieceMaybe, lockedBoard } = getState()
  if (isColliding(lockedBoard, pieceMaybe)) {
    dispatch(resetPiece(currentPiece))
  }
  dispatch(updateCurrentPiece(getState().currentPiece, lockedBoard))
}

// TODO: find a way to test this
// TODO: handle offsets
const handleRotation = () => (dispatch, getState) => {
  dispatch(rotate())
  const { currentPiece, lockedBoard } = getState()
  dispatch(updateCurrentPiece(currentPiece, lockedBoard))
}

const handleEvents = dispatch => e => {
  switch (e.keyCode) {
    case LEFT:
      dispatch(move(-1))
      break
    case RIGHT:
      dispatch(move(1))
      break
    case UP:
      dispatch(handleRotation())
      break
    case DOWN:
      dispatch(pieceDown())
      break
    default:
      dispatch({type: 'KEYDOWN', keyCode: e.keyCode})
  }
}

export const startGameTimer = () => dispatch => {
  requestAnimationFrame(animationHandler(dispatch, 0))
  window.addEventListener('keydown', handleEvents(dispatch))
}

export const stopGameTimer = () => {
  window.removeEventListener('keydown')
}