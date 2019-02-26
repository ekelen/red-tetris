import {
  ENTER_GAME_FAIL,
  SERVER_ENTER_GAME,
  MSG_USAGE,
} from '../../common/constants';

export const parseURL = (url) => {
  const validMultiplayerUrl = /^[\/][a-zA-Z0-9]{3,20}[\[][a-zA-Z0-9]{3,20}[\]]$/g
  const isValid = validMultiplayerUrl.test(url)

  if (!isValid) return ({
    type: ENTER_GAME_FAIL,
    errmsg: `${MSG_USAGE}`
  })

  const alphaNum = /[a-zA-Z0-9]{3,20}/g
  const [roomName, playerName] = url.match(alphaNum)
  return ({
    type: SERVER_ENTER_GAME,
    roomName,
    playerName
  })
}
