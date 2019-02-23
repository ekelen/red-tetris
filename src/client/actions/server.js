import { SERVER_START_GAME, SERVER_PING } from '../../common/constants';

export const ping = () => {
  return {
    type: SERVER_PING
  }
}

export const startGame = () => {
  return ({
    type: SERVER_START_GAME,
  })
}
