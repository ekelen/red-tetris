import debug from 'debug'

const logerror = debug('tetris:error'), loginfo = debug('tetris:info')
import Game from './Game.class'
import Player from './Player.class';
import { SERVER_ENTER_GAME } from '../common/constants';

export const initEngine = (io, games) => {
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
        if (Game.doesRoomExist(games, roomName)) {
          const game = Game.getRoomFromName(games, roomName)
          game.joinGame({ io, player, playerName, roomName })
        } else {
          Game.createGame({ games, player, playerName, roomName })
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
        const game = games.find(game => game.playerNames.includes(playerName))
        if (game) {
          game.playerLeavesGame({ games, player })
        }
      }
    })
  })
}