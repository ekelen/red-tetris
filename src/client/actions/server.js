import { SERVER_START_GAME } from '../../../common/constants';

export const ping = () => {
  return {
    type: 'server/ping'
  }
}

export const startGame = () => {
  return ({
    type: SERVER_START_GAME
  })
}