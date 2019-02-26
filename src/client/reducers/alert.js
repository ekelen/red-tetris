import { ENTER_GAME_FAIL, CREATE_GAME_SUCCESS, UPDATE_GAME, ALERT_POP, ALERT_ERROR } from '../../common/constants';

const initialState = {
  message: '',
  errmsg: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case ALERT_POP:
    return {
      ...state,
      message: action.message,
      errmsg: ''
    }
  case CREATE_GAME_SUCCESS:
    return {
      ...state,
      errmsg: '',
      message: 'You have created a game!'
    }
  case ALERT_ERROR:
    return {
      ...state,
      errmsg: action.errmsg,
      message: ''
    }
  case ENTER_GAME_FAIL:
    return {
      ...state,
      errmsg: action.errmsg || 'Failed to enter this game',
      message: ''
    }
  case UPDATE_GAME:
    return {
      ...state,
      errmsg: '',
      message: action.message || ''
    }
  default:
    return state
  }
}

export default reducer
