import debug from 'debug'

const logerror = debug('tetris:error'), loginfo = debug('tetris:info')
import Game from './Game.class'
import Player from './Player.class';

const games = []

export const joinGame = ({ game, player, playerName, roomName, nPlayers }) => {
  try {
    player.playerName = playerName
    game.addPlayer(player)
    player.socket.join('roomName')
    return ({
      type: 'JOIN_MULTIPLAYER_GAME',
      currNPlayers: game.players.length + 1,
      nPlayers,
      playerName: player.playerName,
      roomName
    })
  } catch (error) {
    return ({ type: 'ROOM_ERROR', err: `Error joining ${roomName}: ${error.message}` })
  }
}

export const createGame = ({ nPlayers, player, playerName, roomName }) => {
  try {
    player.playerName = playerName
    const game = new Game({ nPlayers, player, roomName })
    games.push(game)
    player.socket.join('roomName')
    return ({ type: 'CREATE_MULTIPLAYER_GAME', nPlayers, playerName, roomName })
  } catch (error) {
    logerror(error)
    return ({ type: 'CREATE_GAME_ERROR', err: `Error creating game: ${error.message}` })
  }
}

export const initEngine = io => {
  io.on('connection', socket => {
    loginfo(`Socket connected: ${socket.id}`)
    const player = new Player({ socket })

    socket.on('action', (action) => {
      loginfo('action received : ', action)
      switch (action.type) {
      case 'server/ping':
        return socket.emit('action', { type: 'pong' })
      case 'server/ENTER_MULTIPLAYER_GAME':
        const { playerName, roomName, nPlayers } = action
        if (Game.doesRoomExist(games, roomName)) {
          const game = Game.getRoomFromName(games, roomName)
          socket.emit('action', joinGame({ game, player, playerName, roomName, nPlayers }))
        } else {
          socket.emit('action', createGame({ player, playerName, roomName, nPlayers }))
        }
        return
      default:
        break;
      }
    })
  })
}