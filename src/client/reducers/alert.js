import {
  ALERT_POP
} from '../actions/alert'
import { ENTER_GAME_FAIL, START_SINGLE_PLAYER_GAME, JOIN_GAME_SUCCESS, CREATE_GAME_SUCCESS, UPDATE_GAME } from '../../../common/constants';

const initialState = {
  message: '',
  errmsg: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ALERT_POP:
      return {
        ...initialState,
        message: action.message
      }
    case JOIN_GAME_SUCCESS:
      return {
        ...initialState,
        message: '♥ You have joined a game!'
      }
    case CREATE_GAME_SUCCESS:
      return {
        ...initialState,
        message: '♥ You have created a game!'
      }
    case START_SINGLE_PLAYER_GAME:
    {
      return {
        ...initialState,
        message: '♥ You are starting a single player game!'
      }
    }
    case 'ALERT_ERROR':
      return {
        ...initialState,
        errmsg: action.errmsg,
      }
    case ENTER_GAME_FAIL:
      return {
        ...initialState,
        errmsg: action.errmsg
      }
    case UPDATE_GAME:
      return {
        ...initialState,
        message: action.message || ''
      }
    default:
      return state
  }
}

export default reducer
