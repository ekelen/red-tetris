import {
  ALERT_POP
} from '../actions/alert'
import { ENTER_GAME_FAIL, START_SINGLE_PLAYER_GAME, JOIN_GAME_SUCCESS, CREATE_GAME_SUCCESS, UPDATE_GAME, END_GAME, START_GAME } from '../../common/constants';

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
  case JOIN_GAME_SUCCESS:
    return {
      ...state,
      message: '♥ You have joined a game!',
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
  case START_SINGLE_PLAYER_GAME:
  {
    return {
      ...state,
      errmsg: '',
      message: '♥ You are starting a single player game!',
      history: updateMessageHistory(state.errmsg, state.message, state.history)
    }
  }
  case 'ALERT_ERROR':
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
  case END_GAME:
    return {
      ...state,
      errmsg: '',
      message: action.message || 'Game has ended!',
      history: updateMessageHistory(state.errmsg, state.message, state.history)
    }
  case START_GAME:
    return {
      ...state,
      errmsg: '',
      message: action.message || 'Game has started!',
      history: updateMessageHistory(state.errmsg, state.message, state.history)
    }
  default:
    return state
  }
}

export default reducer
