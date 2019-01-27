export const START_SINGLE_PLAYER_GAME = 'START_SINGLE_PLAYER_GAME'
export const START_MULTI_PLAYER_GAME = 'START_MULTI_PLAYER_GAME'
export const URL_INPUT_ERROR = 'URL_INPUT_ERROR'

const _parseURL = (url) => {
  const validMultiplayerUrl = /^[\/][2-5][-][a-zA-Z0-9]{1,20}[\[][a-zA-Z0-9]{1,20}[\]]$/g
  const isValid = validMultiplayerUrl.test(url)

  if (!isValid) return ({type: URL_INPUT_ERROR })

  const alphaNum = /[a-zA-Z0-9]{1,20}/g
  const [nPlayers, roomName, playerName] = url.match(alphaNum)
  return ({ type: START_MULTI_PLAYER_GAME, nPlayers, roomName, playerName })
}

export const parseURL = (url) => {
  switch (url) {
    case '/':
      return ({type: START_SINGLE_PLAYER_GAME})
    default:
      return _parseURL(url)
  }
}