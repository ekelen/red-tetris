import alert from './alert'
import game from './game'
import board from './board'
import currentPiece from './currentPiece'
import lockedBoard from './lockedBoard'
import { combineReducers } from 'redux'

const reducers = combineReducers({
  alert,
  game,
  currentPiece,
  lockedBoard,
  board
})

export default reducers
