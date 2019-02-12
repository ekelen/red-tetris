export const START_SINGLE_PLAYER_GAME = 'START_SINGLE_PLAYER_GAME'
export const CREATE_MULTIPLAYER_GAME = 'CREATE_MULTIPLAYER_GAME'

export const JOIN_MULTIPLAYER_GAME = 'JOIN_MULTIPLAYER_GAME' // can join

export const SERVER_ENTER_MULTIPLAYER_GAME = 'server/ENTER_MULTIPLAYER_GAME'

export const URL_INPUT_ERROR = 'URL_INPUT_ERROR'

const _parseURL = (url) => {
  const validMultiplayerUrl = /^[\/][a-zA-Z0-9]{1,20}[\[][a-zA-Z0-9]{1,20}[\]]$/g
  const isValid = validMultiplayerUrl.test(url)

  if (!isValid) return ({ type: 'ENTER_GAME_FAIL', errmsg: 'Invalid URL entered. (Usage: ...)' })

  const alphaNum = /[a-zA-Z0-9]{1,20}/g
  const [roomName, playerName] = url.match(alphaNum)
  return ({ type: SERVER_ENTER_MULTIPLAYER_GAME, roomName, playerName })
}

export const parseURL = (url) => {
  switch (url) {
    case '/':
      return ({type: START_SINGLE_PLAYER_GAME})
    default:
      return _parseURL(url)
  }
}