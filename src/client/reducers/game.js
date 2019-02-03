import { START_SINGLE_PLAYER_GAME, CREATE_MULTIPLAYER_GAME, ENTER_MULTIPLAYER_GAME, URL_INPUT_ERROR } from "../actions/parse";

const initialState = {
  alive: false,
  currNPlayers: 1, // current number of players
  nPlayers: 1, // n players specified in URL
  playerName: '',
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
    case ENTER_MULTIPLAYER_GAME: // Placeholder reducer for when server accepts client into existing room
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
    default:
      return state
  }
}

export default reducer
