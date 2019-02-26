import {
  cloneDeep
} from 'lodash'
import {
  START_SINGLE_PLAYER_GAME,
  ENTER_GAME_FAIL,
  CREATE_GAME_SUCCESS,
  UPDATE_GAME,
  SERVER_ENTER_GAME
} from '../../common/constants'
import { PLAYER_DIES, UPDATE_PLAYER_GHOST } from '../actions/player'
import { EMPTY_BOARD } from './board';

const initialState = {
  alive: false,
  ghost: EMPTY_BOARD,
  opponents: [], // { alive, ghost, pieceIndex, playerName, waiting }
  pieceIndex: 0,
  playerName: '',
  waiting: null,
}

const getOpponents = (players, myName) => cloneDeep(players.filter(p => p.playerName !== myName))
const getPlayer = (players, myName) => cloneDeep(players.find(p => p.playerName === myName))

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case START_SINGLE_PLAYER_GAME:
    return {
      ...state,
      alive: true,
      waiting: false
    }
  case ENTER_GAME_FAIL:
    return initialState
  case CREATE_GAME_SUCCESS:
    return {
      ...state,
      playerName: action.playerName,
      roomName: action.roomName,
      waiting: false
    }
  case SERVER_ENTER_GAME:
    return {
      ...state,
      playerName: action.playerName,
      roomName: action.roomName
    }
  case UPDATE_GAME:
    return {
      ...state,
      opponents: getOpponents(action.players, state.playerName),
      ...getPlayer(action.players, state.playerName) // playerName, alive, ghost, pieceIndex, waiting
    }
  case PLAYER_DIES:
    return {
      ...state,
      alive: false
    }
  case UPDATE_PLAYER_GHOST:
    return {
      ...state,
      ghost: action.ghost,
      pieceIndex: state.pieceIndex + 1
    }
  default:
    return state
  }
}

export default reducer
