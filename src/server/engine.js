import Game from './Game.class'
import Player from './Player.class';
import { SERVER_ENTER_GAME, SERVER_START_GAME, SERVER_PLAYER_DESTROYS_LINE, SERVER_PLAYER_LOCKS_PIECE, SERVER_PLAYER_DIES } from '../common/constants';
import { loginfo, logerror } from '.';

// TODO: Totally untested also kind of gangly
export const initEngine = (io, games) => {
  let player, currentGame, game = null
  io.on('connection', socket => {
    loginfo(`Socket connected: ${socket.id}`)
    player = new Player({ socket })

    socket.on('action', (action) => {
      loginfo('action received : ', action)
      currentGame = games.find(g => g.players.find(p => p.id === socket.id)) || null
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
        return (currentGame) ? currentGame.startGame({ io }) : logerror('current game for this socket id not found.')
      case SERVER_PLAYER_DESTROYS_LINE:
        return (currentGame) ? currentGame.playerDestroysLine({ playerName: player.playerName, ghost: player.ghost }) : logerror('current game for this socket id not found.')
      case SERVER_PLAYER_LOCKS_PIECE:
        return (currentGame) ? currentGame.playerLocksPiece({ playerName: player.playerName, ghost: player.ghost }) : logerror('current game for this socket id not found.')
      case SERVER_PLAYER_DIES:
        return currentGame ? currentGame.playerDies({ io, playerName: player.playerName }) : logerror('current game for this socket id not found.')
      default:
        break;
      }
    })

    socket.on('disconnect', () => {
      loginfo('Player disconnected', player.socket.id)
      return (currentGame && player.playerName) ? currentGame.playerLeavesGame({ io, games, player }) : {}
    })
  })
}