import {
  EMPTY_BOARD
} from "../actions/game";
import { START_SINGLE_PLAYER_GAME, START_MULTI_PLAYER_GAME, URL_INPUT_ERROR } from "../actions/parse";

const initialState = {
  alive: false,
  board: EMPTY_BOARD,
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
      return { ...state,
        alive: true,
        started: true
      }
    case START_MULTI_PLAYER_GAME:
      return { ...state,
          alive: true,
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
