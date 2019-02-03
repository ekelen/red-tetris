import {
  ALERT_POP
} from '../actions/alert'

const initialState = {
  message: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ALERT_POP:
      return {
        message: action.message
      }
    default:
      return state
  }
}

export default reducer
