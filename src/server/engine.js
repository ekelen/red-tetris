import Game from './Game.class'
import Player from './Player.class';
import { SERVER_ENTER_GAME, SERVER_START_GAME, SERVER_PLAYER_DESTROYS_LINE, SERVER_PLAYER_LOCKS_PIECE, SERVER_PLAYER_DIES } from '../common/constants';
import { loginfo, logerror } from '.';

const inGameActionHandler = ({ action, io, currentGame, player }) => {
  switch (action.type) {
  case SERVER_START_GAME:
    return currentGame.startGame({ io, player })
  case SERVER_PLAYER_DESTROYS_LINE:
    return currentGame.playerDestroysLine({ playerName: player.playerName, ghost: player.ghost })
  case SERVER_PLAYER_LOCKS_PIECE:
    return currentGame.playerLocksPiece({ playerName: player.playerName, ghost: player.ghost })
  case SERVER_PLAYER_DIES:
    return currentGame.playerDies({ io, playerName: player.playerName })
  default:
    logerror(`Unrecognized or unauthorized action ${action.type}`)
    break;
  }
}

export const initEngine = (io, games) => {
  io.on('connection', socket => {
    loginfo(`Socket connected: ${socket.id}`)
    const player = new Player({ socket })
    let currentGame = null,
      game = null

    socket.on('action', (action) => {
      loginfo('action received : ', action)
      currentGame = games.find(g => g.players.find(p => p.id === socket.id)) || null

      if (currentGame)
        return inGameActionHandler({ action, io, games, currentGame, player, socket })

      switch (action.type) {
      case 'server/ping':
        return socket.emit('action', { type: 'pong' })
      case SERVER_ENTER_GAME:
        const { playerName, roomName } = action
        game = Game.getGameFromName(games, roomName)
        return (game) ?
          game.joinGame({ io, player, playerName, roomName }) :
            Game.createGame({ games, player, playerName, roomName })
      default:
        logerror(`Unrecognized or unauthorized action ${action.type}`)
        break;
      }
    })

    socket.on('disconnect', () => {
      currentGame = games.find(g => g.players.find(p => p.id === socket.id)) || null
      loginfo(`${socket.id} (${player.playerName}) disconnected!`)
      return (currentGame && player.playerName) ? currentGame.playerLeavesGame({ io, games, player }) : {}
    })
  })
}