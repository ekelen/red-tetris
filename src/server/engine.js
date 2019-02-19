import Game from './Game.class'
import Player from './Player.class';
import { SERVER_ENTER_GAME, SERVER_START_GAME, SERVER_PLAYER_DESTROYS_LINE, SERVER_PLAYER_LOCKS_PIECE, SERVER_PLAYER_DIES } from '../common/constants';
import { loginfo } from '.';

export const initEngine = (io, games) => {
  let player, game = null
  io.on('connection', socket => {
    loginfo(`Socket connected: ${socket.id}`)
    player = new Player({ socket })

    socket.on('action', (action) => {
      loginfo('action received : ', action)
      switch (action.type) {
      case 'server/ping':
        return socket.emit('action', { type: 'pong' })
      case SERVER_ENTER_GAME:
        const { playerName, roomName } = action
        game = Game.getGameFromName(games, roomName)
        if (game)
          game.joinGame({ player, playerName, roomName })
        else
          Game.createGame({ games, player, playerName, roomName })
        return
      case SERVER_START_GAME:
        game = Game.getGameFromName(games, roomName)
        if (game)
          game.startGame({ io })
        return
      case SERVER_PLAYER_DESTROYS_LINE:
        return
      case SERVER_PLAYER_LOCKS_PIECE:
        return
      case SERVER_PLAYER_DIES:
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