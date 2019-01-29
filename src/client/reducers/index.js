import alert from './alert'
import game from './game'
import board from './board'
import currentPiece from './currentPiece'
import { combineReducers } from 'redux'

const reducers = combineReducers({
  alert,
  game,
  currentPiece,
  board
})

export default reducers
