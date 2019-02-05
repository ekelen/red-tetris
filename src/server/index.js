import fs  from 'fs'
import debug from 'debug'
import Game from './Game.class'

const games = []

const logerror = debug('tetris:error')
  , loginfo = debug('tetris:info')

const initApp = (app, params, cb) => {
  const {host, port} = params
  const handler = (req, res) => {
    const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html'
    fs.readFile(__dirname + file, (err, data) => {
      if (err) {
        logerror(err)
        res.writeHead(500)
        return res.end('Error loading index.html')
      }
      res.writeHead(200)
      res.end(data)
    })
  }

  app.on('request', handler)

  app.listen({host, port}, () =>{
    loginfo(`tetris listen on ${params.url}`)
    cb()
  })
}

const initEngine = io => {
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

export function create(params){
  const promise = new Promise( (resolve, reject) => {
    const app = require('http').createServer()
    initApp(app, params, () =>{
      const io = require('socket.io')(app)
      const stop = (cb) => {
        io.close()
        app.close( () => {
          app.unref()
        })
        loginfo(`Engine stopped.`)
        cb()
      }

      initEngine(io)
      resolve({stop})
    })
  })
  return promise
}
