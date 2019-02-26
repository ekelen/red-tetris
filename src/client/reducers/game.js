import {
  cloneDeep
} from 'lodash'
import {
  ENTER_GAME_FAIL,
  CREATE_GAME_SUCCESS,
  UPDATE_GAME
} from '../../common/constants'

const initialState = {
  activePlayers: [],
  inProgress: false,
  pieceLineup: [],
  players: [],
  roomName: '',
  urlParsed: false,
}

const getActivePlayers = (players) => cloneDeep(players.filter(p => !p.waiting))

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case ENTER_GAME_FAIL:
    return {
      ...state,
      urlParsed: true
    }
  case CREATE_GAME_SUCCESS:
    return {
      ...state,
      activePlayers: getActivePlayers(action.players),
      pieceLineup: cloneDeep(action.pieceLineup),
      players: cloneDeep(action.players),
      roomName: action.roomName,
      urlParsed: true,
    }
  case UPDATE_GAME:
    return {
      ...state,
      activePlayers: getActivePlayers(action.players),
      inProgress: action.inProgress,
      pieceLineup: cloneDeep(action.pieceLineup),
      players: cloneDeep(action.players),
      roomName: action.roomName,
      urlParsed: true
    }
  default:
    return state
  }
}

export default reducer
