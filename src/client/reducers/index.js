import alert from './alert'
import board from './board'
import currentPiece from './currentPiece'
import game from './game'
import lockedBoard from './lockedBoard'
import player from './player'
import { combineReducers } from 'redux'

const reducers = combineReducers({
  alert,
  board,
  currentPiece,
  game,
  lockedBoard,
  player,
})

export default reducers
