import {
  cloneDeep
} from 'lodash'
import {
  START_SINGLE_PLAYER_GAME,
  ENTER_GAME_FAIL,
  CREATE_GAME_SUCCESS,
  JOIN_GAME_SUCCESS,
  UPDATE_GAME,
  END_GAME,
  START_GAME
} from '../../common/constants';

const initialState = {
  activePlayers: [],
  inProgress: false,
  offlineMode: false,
  pieces: [],
  players: [],
  roomName: '',
  urlParsed: false
}

const getActivePlayers = (players) => cloneDeep(players.filter(p => !p.waiting))

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case START_SINGLE_PLAYER_GAME:
    return {
      ...state,
      alive: true,
      offlineMode: true,
      inProgress: true,
      urlParsed: true
    }
  case ENTER_GAME_FAIL:
    return {
      ...state,
      urlParsed: true
    }
  case CREATE_GAME_SUCCESS:
    return {
      ...state,
      activePlayers: cloneDeep(getActivePlayers(action.players)),
      pieces: cloneDeep(action.pieceLineup),
      players: cloneDeep(action.players),
      roomName: action.roomName,
      urlParsed: true,
    }
  case JOIN_GAME_SUCCESS:
    return {
      ...state,
      activePlayers: getActivePlayers(action.players),
      inProgress: action.inProgress,
      pieces: cloneDeep(action.pieceLineup),
      players: cloneDeep(action.players),
      roomName: action.roomName,
      urlParsed: true
    }
  case START_GAME:
    return {
      ...state,
      inProgress: true,
      pieceLineup: cloneDeep(action.pieceLineup)
    }
  case UPDATE_GAME:
    return {
      ...state,
      activePlayers: getActivePlayers(action.players),
      inProgress: action.inProgress,
      pieces: cloneDeep(action.pieceLineup),
      players: cloneDeep(action.players),
      roomName: action.roomName,
      urlParsed: true
    }
  case END_GAME:
    return {
      ...state,
      activePlayers: getActivePlayers(action.players),
      inProgress: action.inProgress,
      pieces: cloneDeep(action.pieceLineup),
      players: cloneDeep(action.players)
    }
  case 'GAME_LOOP_STARTED':
    return {
      ...state,
      inProgress: true
    }
  default:
    return state
  }
}

export default reducer
