import debug from 'debug'

const logerror = debug('tetris:error')
  , loginfo = debug('tetris:info')
  
import Game from './Game.class'

const games = []

export const joinGame = ({game, playerName, roomName, nPlayers}) => {
  try {
    game.addPlayer(playerName)
    return({ type: 'JOIN_MULTIPLAYER_GAME', currNPlayers: game.players.length + 1, nPlayers, playerName, roomName })
  } catch (error) {
    return({ type: 'ROOM_ERROR', err: `Error joining ${game.roomName}: ${error.message}` })
  }
}

export const createGame = ({nPlayers, playerName, roomName}) => {
  try {
    let game = new Game({nPlayers, playerName, roomName})
    games.push(game)
    return ({ type: 'CREATE_MULTIPLAYER_GAME', nPlayers, playerName, roomName })
  } catch (error) {
    logerror(error)
    return ({ type: 'CREATE_GAME_ERROR', err: `Error creating game: ${error.message}` })
  }
}

export const initEngine = io => {
  io.on('connection', function(socket){
    loginfo("Socket connected: " + socket.id)
  
    socket.on('action', (action) => {
      loginfo('action received : ', action)
      switch (action.type) {
        case 'server/ping':
          socket.emit('action', {type: 'pong'})
          break
        case 'server/ENTER_MULTIPLAYER_GAME':
          // TODO: Socketio room/namespace init
          const { playerName, roomName, nPlayers } = action
          if (Game.doesRoomExist(games, roomName)) {
            const game = Game.getRoomFromName(games, roomName)
            socket.emit('action', joinGame({game, playerName, roomName, nPlayers}))
          } else {
            socket.emit('action', createGame({playerName, roomName, nPlayers}))
          }
          break;
        default:
          break;
      }
    })
  })
}