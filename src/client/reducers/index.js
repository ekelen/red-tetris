import alert from './alert'
import board from './board'
import currentPiece from './currentPiece'
import game from './game'
import player from './player'
import { combineReducers } from 'redux'

const reducers = combineReducers({
  alert,
  board,
  currentPiece,
  game,
  player,
})

export default reducers
