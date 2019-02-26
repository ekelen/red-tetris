import { SERVER_START_GAME, SERVER_PING } from '../../common/constants';

export const ping = () => ({
  type: SERVER_PING
})

export const startGame = () => ({
  type: SERVER_START_GAME,
})
