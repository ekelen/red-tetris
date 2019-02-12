import { START_SINGLE_PLAYER_GAME, CREATE_MULTIPLAYER_GAME, JOIN_MULTIPLAYER_GAME, URL_INPUT_ERROR } from "../actions/parse";
import { cloneDeep } from 'lodash'

const initialState = {
  alive: false,
  errmsg: '',
  currNPlayers: 1, // current number of players
  nPlayers: 1, // current number of players
  playerName: '',
  playerNames: [],
  players: [],
  roomName: '',
  started: false,
  opponents: [],
  pieces: [],
  urlInputError: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case START_SINGLE_PLAYER_GAME:
      return {
        ...state,
        alive: true,
        started: true
      }
    case CREATE_MULTIPLAYER_GAME:
      return { ...state,
          alive: true,
          nPlayers: action.nPlayers,
          roomName: action.roomName,
          playerName: action.playerName
      }
    case JOIN_MULTIPLAYER_GAME: // Placeholder reducer for when server accepts client into existing room
      return  { ...state,
        currNPlayers: action.currNPlayers,
        nPlayers: action.nPlayers,
        roomName: action.roomName,
        playerName: action.playerName
      }
    case URL_INPUT_ERROR:
      return { ...state,
        urlInputError: true
      }
    case 'ENTER_GAME_FAIL': // Placeholder reducer for when server accepts client into existing room
      return  {
        ...state,
        errmsg: action.errmsg
      }
    case 'CREATE_GAME_SUCCESS':
      return {
        ...state,
        errmsg: '',
        playerName: action.playerName,
        roomName: action.roomName,
        playerNames: [...action.playerNames]
      }
    case 'JOIN_GAME_SUCCESS':
      return {
        ...state,
        errmsg: '',
        nPlayers: action.nPlayers,
        players: cloneDeep(action.players),
        playerName: action.playerName,
        roomName: action.roomName
      }
    case 'UPDATE_GAME':
      return {
        ...state,
        playerNames: [...action.playerNames],
        players: cloneDeep(action.players),
        nPlayers: action.nPlayers
      }
    default:
      return state
  }
}

export default reducer
