import { ALERT_POP } from '../../common/constants';

export const alert = (message) => ({
  type: ALERT_POP,
  errmsg: '',
  message
})
