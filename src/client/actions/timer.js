export const TIMER_START = 'TIMER_START'
export const TIMER_TICK = 'TIMER_TICK'
export const TIMER_STOP = 'TIMER_STOP'

let timer = null

const tick = () => ({ type: TIMER_TICK })

export const startTimer = () => (dispatch) => {
  clearInterval(timer)
  timer = setInterval(() => dispatch(tick()), 1000)
  dispatch({ type: TIMER_START })
  dispatch(tick())
}

export const stopTimer = () => {
  clearInterval(timer)
  return { type: TIMER_STOP }
}