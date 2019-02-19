import {
  cloneDeep
} from 'lodash'
import {
  START_SINGLE_PLAYER_GAME,
  ENTER_GAME_FAIL,
  CREATE_GAME_SUCCESS,
  JOIN_GAME_SUCCESS,
  UPDATE_GAME,
  END_GAME
} from '../../common/constants';

const initialState = {
  alive: false,
  opponents: [], // { alive, ghost, pieceIndex, playerName, waiting }
  playerName: '',
  pieceIndex: 0,
  waiting: null
}

const getOpponents = (players, myName) => cloneDeep(players.filter(p => p.playerName !== myName))
const getPlayer = (players, myName) => cloneDeep(players.find(p => p.playerName === myName))
const getProp = (source) => (prop, defaut) => source.hasOwnProperty(prop) ? cloneDeep(source.prop) : defaut

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
  case JOIN_GAME_SUCCESS:
    return {
      ...state,
      playerName: action.playerName,
      opponents: getOpponents(action.players, action.playerName),
      waiting: action.waiting,
    }
  case UPDATE_GAME:
    return {
      ...state,
      opponents: getOpponents(action.players, state.playerName),
      ...getPlayer(action.players, state.playerName) // playerName, alive, ghost, pieceIndex, waiting
    }
  case END_GAME:
    return {
      ...state,
      opponents: getOpponents(action.players, state.playerName),
      ...getPlayer(action.players, state.playerName) // playerName, alive, ghost, pieceIndex, waiting
    }
  default:
    return state
  }
}

export default reducer
