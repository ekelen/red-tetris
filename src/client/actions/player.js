import { SERVER_PLAYER_DIES, SERVER_PLAYER_LOCKS_PIECE } from "../../common/constants";

export const PLAYER_DIES = 'PLAYER_DIES'

export const playerDies = () => ({type: PLAYER_DIES})
export const serverPlayerDies = () => ({type: SERVER_PLAYER_DIES})
export const serverPlayerLocksPiece = ghost => ({type: SERVER_PLAYER_LOCKS_PIECE, ghost})