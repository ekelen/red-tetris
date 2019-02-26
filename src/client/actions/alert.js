import { ALERT_POP } from '../../common/constants';

export const alert = (message) => {
  return {
    type: ALERT_POP,
    errmsg: '',
    message
  }
}
