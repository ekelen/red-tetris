/**
|--------------------------------------------------
| MESSAGES
|--------------------------------------------------
*/

export const MSG_USAGE = 'ERROR: Expected multiplayer URL format:' +
  ' localhost:8080/#<room_name>[<player_name>]'

/**
|--------------------------------------------------
| ACTION TYPES// playerName, alive, ghost, pieceIndex,
| waiting// playerName, alive,// playerName, alive, ghost,
| pieceIndex, waiting// playerName, alive, ghost, pieceIndex, waiting ghost, pieceIndex, waiting
|--------------------------------------------------
*/

// Status alerts
export const PONG = 'PONG'
export const ALERT_POP = 'ALERT_POP'
export const ALERT_ERROR = 'ALERT_ERROR'

// Game management
export const CREATE_GAME_SUCCESS = 'CREATE_GAME_SUCCESS'
export const ENTER_GAME_FAIL = 'ENTER_GAME_FAIL'
export const UPDATE_GAME = 'UPDATE_GAME'

// Emit-to-server action types
export const SERVER_PING = 'SERVER_PING'
export const SERVER_ENTER_GAME = 'SERVER_ENTER_GAME'
export const SERVER_START_GAME = 'SERVER_START_GAME'
export const SERVER_PLAYER_DIES = 'SERVER_PLAYER_DIES'
export const SERVER_PLAYER_LOCKS_PIECE = 'SERVER_PLAYER_LOCKS_PIECE'
export const SERVER_SEND_LINE_PENALTIES = 'SERVER_SEND_LINE_PENALTIES'
export const SERVER_UPDATES_PLAYER = 'SERVER_UPDATES_PLAYER'

/**
|--------------------------------------------------
| NUMERIC CONSTANTS
|--------------------------------------------------
*/

export const MIN_N_PIECES_REMAINING = 10
export const START_N_PIECES = 50
export const N_PIECES_TO_APPEND = 50
export const PIECE_START_POS = [1, 4]

export const MAX_ACTIVE_PLAYERS = 5
