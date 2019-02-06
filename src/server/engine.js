import debug from 'debug'

const logerror = debug('tetris:error')
  , loginfo = debug('tetris:info')
  
import Game from './Game.class'

const games = []

export const initEngine = io => {
  io.on('connection', function(socket){
    loginfo("Socket connected: " + socket.id)
  
    socket.on('action', (action) => {
      loginfo('action received : ', action)
      switch (action.type) {
        case 'server/ping':
          socket.emit('action', {type: 'pong'})
        case 'server/ENTER_MULTIPLAYER_GAME':
          // TODO: Socketio room/namespace init
          const { playerName, roomName, nPlayers } = action
          if (Game.doesRoomExist(games, roomName)) {
            // TODO: Check player allowed to enter room
            const game = Game.getRoomFromName(games, roomName)
            if (!game.isFull()) {
              game.addPlayer(playerName)
              socket.emit(
                'action', 
                { type: 'JOIN_MULTIPLAYER_GAME', currNPlayers: game.players.length + 1, nPlayers, playerName, roomName })
            } else {
              socket.emit(
                'action',
                { type: 'ROOM_ERROR', err: `room ${game.roomName} is full` }
              )
            }
          } else {
            let game = new Game({ nPlayers, playerName, roomName, io })
            games.push(game)
            socket.emit(
              'action',
              { type: 'CREATE_MULTIPLAYER_GAME', nPlayers, playerName, roomName })
          }
          break;
        default:
          break;
      }
    })
  })
}