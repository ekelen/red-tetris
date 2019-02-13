import {
  cloneDeep
} from 'lodash'
import {
  START_SINGLE_PLAYER_GAME,
  ENTER_GAME_FAIL,
  CREATE_GAME_SUCCESS,
  JOIN_GAME_SUCCESS,
  UPDATE_GAME
} from '../../../common/constants';

// TODO: Split this file? e.g. with a Player reducer (for my status) ?
const initialState = {
  alive: false,
  nPlayers: 1,
  playerName: '',
  playerNames: [],
  players: [],
  roomName: '',
  started: false,
  opponents: [], // { alive, ghost, pieceIndex, playerName }
  pieces: [],
  offlineMode: false, // TODO: Decide if keeping or what
  urlParsed: false
}

const getOpponents = (players, myName) => cloneDeep(players.filter(p => p.playerName !== myName))

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case START_SINGLE_PLAYER_GAME:
    return {
      ...state,
      alive: true,
      offlineMode: true,
      started: true,
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
      playerName: action.playerName,
      playerNames: [...action.playerNames],
      players: cloneDeep(action.players),
      roomName: action.roomName,
      urlParsed: true,
      pieces: cloneDeep(action.pieceLineup)
    }
  case JOIN_GAME_SUCCESS:
    return {
      ...state,
      nPlayers: action.nPlayers,
      playerName: action.playerName,
      players: cloneDeep(action.players),
      opponents: getOpponents(action.players, action.playerName),
      roomName: action.roomName,
      pieces: cloneDeep(action.pieceLineup),
      urlParsed: true
    }
  case UPDATE_GAME:
    return {
      ...state,
      nPlayers: action.nPlayers,
      opponents: getOpponents(action.players, state.playerName),
      playerNames: [...action.playerNames],
      players: cloneDeep(action.players),
      pieces: cloneDeep(action.pieceLineup)
    }
  case 'GAME_LOOP_STARTED':
    return {
      ...state,
      started: true
    }
  default:
    return state
  }
}

export default reducer
