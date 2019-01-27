import alert from './alert'
import game from './game'
import { combineReducers } from 'redux'

const reducers = combineReducers({
  alert,
  game
})

export default reducers
