import {
  ALERT_POP
} from '../actions/alert'
import { ENTER_GAME_FAIL, CREATE_GAME_SUCCESS, UPDATE_GAME, ALERT_ERROR } from '../../common/constants';

const initialState = {
  message: '',
  errmsg: '',
  history: []
}

const updateMessageHistory = (errmsg, message, history) => (errmsg || message) ?
  [message || errmsg, ...history] :
   history

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case ALERT_POP:
    return {
      ...state,
      message: action.message,
      errmsg: '',
      history: updateMessageHistory(state.errmsg, state.message, state.history)
    }
  case CREATE_GAME_SUCCESS:
    return {
      ...state,
      errmsg: '',
      message: '♥ You have created a game!',
      history: updateMessageHistory(state.errmsg, state.message, state.history)
    }
  case ALERT_ERROR:
    return {
      ...state,
      errmsg: action.errmsg,
      message: '',
      history: updateMessageHistory(state.errmsg, state.message, state.history)
    }
  case ENTER_GAME_FAIL:
    return {
      ...state,
      errmsg: action.errmsg || 'Failed to enter this game',
      message: '',
      history: updateMessageHistory(state.errmsg, state.message, state.history)
    }
  case UPDATE_GAME:
    return {
      ...state,
      errmsg: '',
      message: action.message || '',
      history: updateMessageHistory(state.errmsg, state.message, state.history)
    }
  default:
    return state
  }
}

export default reducer
