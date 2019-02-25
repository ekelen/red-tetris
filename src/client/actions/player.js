import {
  SERVER_PLAYER_DIES,
  SERVER_PLAYER_LOCKS_PIECE,
  SERVER_SEND_LINE_PENALTIES,
  SERVER_UPDATES_PLAYER
} from "../../common/constants";

export const PLAYER_DIES = 'PLAYER_DIES'
export const UPDATE_PLAYER_GHOST = 'UPDATE_PLAYER_GHOST'

export const playerDies = () => ({ type: PLAYER_DIES })
export const serverPlayerDies = () => ({ type: SERVER_PLAYER_DIES })
export const serverPlayerLocksPiece = ghost => ({ type: SERVER_PLAYER_LOCKS_PIECE, ghost })
export const updatePlayerGhost = ghost => ({ type: UPDATE_PLAYER_GHOST, ghost })


export const serverSendLinePenalities = nLines => ({
  type: SERVER_SEND_LINE_PENALTIES,
  nLines
})

export const serverUpdatesPlayer = updatedPlayer => ({
  type: SERVER_UPDATES_PLAYER,
  player: updatedPlayer
})
