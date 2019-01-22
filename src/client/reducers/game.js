import {
  START_SINGLE_PLAYER_GAME,
  EMPTY_BOARD
} from "../actions/game";

const initialState = {
  alive: false,
  board: EMPTY_BOARD,
  gameTimerStarted: false,
  notInRoom: true
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case START_SINGLE_PLAYER_GAME:
      return { ...state,
        alive: true,
        gameTimerStarted: true,
        notInRoom: false
      }
    default:
      return state
  }
}

export default reducer
