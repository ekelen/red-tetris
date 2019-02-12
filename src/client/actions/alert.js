export const ALERT_POP = 'ALERT_POP'

export const alert = (message) => {
  return {
    type: ALERT_POP,
    errmsg: '',
    message
  }
}

export const alertError = (errmsg) => {
  return {
    type: ALERT_ERROR,
    message: '',
    errmsg: errmsg
  }
}
