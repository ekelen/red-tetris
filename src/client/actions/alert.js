import { ALERT_POP, ALERT_ERROR } from '../../../common/constants';

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
