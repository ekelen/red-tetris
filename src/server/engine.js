import debug from 'debug'

const logerror = debug('tetris:error'), loginfo = debug('tetris:info')
import Game from './Game.class'
import Player from './Player.class';
import { SERVER_ENTER_GAME } from '../common/constants';

global.__games = []

export const initEngine = io => {
  io.on('connection', socket => {
    loginfo(`Socket connected: ${socket.id}`)
    const player = new Player({ socket })

    socket.on('action', (action) => {
      loginfo('action received : ', action)
      switch (action.type) {
      case 'server/ping':
        return socket.emit('action', { type: 'pong' })
      case SERVER_ENTER_GAME:
        const { playerName, roomName } = action
        if (Game.doesRoomExist(roomName)) {
          const game = Game.getRoomFromName(roomName)
          game.joinGame({ io, player, playerName, roomName })
        } else {
          Game.createGame({ player, playerName, roomName })
        }
        return
      default:
        break;
      }
    })

    socket.on('disconnect', () => {
      loginfo('Player disconnected', player.socket.id)
      if (player.playerName) {
        const { playerName } = player
        const game = __games.find(game => game.playerNames.includes(playerName))
        if (game) {
          game.playerLeavesGame({ player })
        }
      }
    })
  })
}