import { pieceFall, updateCurrentPiece } from './game'

export const TIMER_START = 'TIMER_START'
export const TIMER_TICK = 'TIMER_TICK'
export const TIMER_STOP = 'TIMER_STOP'

let timer = null

const tick = () => ({ type: TIMER_TICK })

const update = () => (dispatch, getState) => {
  dispatch(tick())
  dispatch(pieceFall())
  dispatch(updateCurrentPiece(getState().currentPiece))
}

export const startTimer = () => dispatch => {
  clearInterval(timer)
  timer = setInterval(() => dispatch(update()), 1000)
  dispatch({ type: TIMER_START })
}

export const stopTimer = () => {
  clearInterval(timer)
  return { type: TIMER_STOP }
}