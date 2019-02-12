import {
  ENTER_GAME_FAIL,
  SERVER_ENTER_GAME,
  MSG_USAGE,
  START_SINGLE_PLAYER_GAME
} from '../../../common/constants';

const _parseURL = (url) => {
  const validMultiplayerUrl = /^[\/][a-zA-Z0-9]{1,20}[\[][a-zA-Z0-9]{1,20}[\]]$/g
  const isValid = validMultiplayerUrl.test(url)

  if (!isValid) return ({
    type: ENTER_GAME_FAIL,
    errmsg: `BAD URL ENTERED --- ${MSG_USAGE}`
  })

  const alphaNum = /[a-zA-Z0-9]{1,20}/g
  const [roomName, playerName] = url.match(alphaNum)
  return ({
    type: SERVER_ENTER_GAME,
    roomName,
    playerName
  })
}

export const parseURL = (url) => {
  switch (url) {
    case '/':
      return ({
        type: START_SINGLE_PLAYER_GAME
      })
    default:
      return _parseURL(url)
  }
}
