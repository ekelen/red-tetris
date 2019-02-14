/**
|--------------------------------------------------
| MESSAGES
|--------------------------------------------------
*/

export const MSG_USAGE = 'ERROR: Expected multiplayer URL format: localhost:8080/#<num_users>-<room_name>[<player_name>] \nSingle player: localhost:8080/'

/**
|--------------------------------------------------
| ACTION TYPES
|--------------------------------------------------
*/

// Status alerts
export const ALERT_POP = 'ALERT_POP'
export const ALERT_ERROR = 'ALERT_ERROR'

// Game management
export const SERVER_ENTER_GAME = 'SERVER_ENTER_GAME'

export const CREATE_GAME_SUCCESS = 'CREATE_GAME_SUCCESS'
export const ENTER_GAME_FAIL = 'ENTER_GAME_FAIL'
export const JOIN_GAME_SUCCESS = 'JOIN_GAME_SUCCESS'
export const START_SINGLE_PLAYER_GAME = 'START_SINGLE_PLAYER_GAME'
export const UPDATE_GAME = 'UPDATE_GAME'

// Player status management - socket will emit 'UPDATE_GAME' above
export const SERVER_START_GAME = 'SERVER_START_GAME'
export const SERVER_PLAYER_DIES = 'SERVER_PLAYER_DIES'
export const SERVER_PLAYER_LOCKS_PIECE = 'SERVER_PLAYER_LOCKS_PIECE'
export const SERVER_PLAYER_DESTROYS_LINE = 'SERVER_PLAYER_DESTROYS_LINE'
export const SERVER_PLAYER_STARTS_GAME = 'SERVER_PLAYER_DESTROYS_LINE'

/**
|--------------------------------------------------
| NUMERIC CONSTANTS
|--------------------------------------------------
*/

export const MIN_N_PIECES_REMAINING = 10
export const START_N_PIECES = 50
export const N_PIECES_TO_APPEND = 50
