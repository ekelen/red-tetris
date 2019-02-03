import { pieceFall, updateCurrentPiece, pieceLand, resetPiece,  } from './game'
import { isColliding } from './physics'

let timer = null
let start = null

const update = () => (dispatch, getState) => {
  const { currentPiece, lockedBoard } = getState()
  dispatch(pieceFall())
  const { currentPiece: pieceMaybe } = getState()
  if (isColliding(lockedBoard, pieceMaybe)) {
    dispatch(pieceLand(currentPiece))
    dispatch(resetPiece())
  }
  dispatch(updateCurrentPiece(currentPiece, lockedBoard))
}

const animationHandler = dispatch => timestamp => {
  if (!start)
    start = timestamp
  const progress = timestamp - start
  if (progress >= 500) {
    start = timestamp
    dispatch(update())
  }
  requestAnimationFrame(animationHandler(dispatch))
}

export const startTimer = () => dispatch => {
  requestAnimationFrame(animationHandler(dispatch))
}

export const stopTimer = () => {
  clearInterval(timer)
}