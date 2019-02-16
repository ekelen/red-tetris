import fs from 'fs'
import debug from 'debug'
import { initEngine } from './engine';

export const logerror = debug('tetris:error'), loginfo = debug('tetris:info')
global.__games = []

export const create = (params, games) => {
  const promise = new Promise((resolve, reject) => {
    const app = require('http').createServer()

    const { host, port } = params
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

    app.listen({ host, port }, () => {
      loginfo(`Tetris listening on ${params.url}`)

      const io = require('socket.io')(app)
      const stop = (onStop) => {
        io.close()
        app.close(() => {
          app.unref()
        })
        loginfo('Engine stopped.')
        if (onStop)
          onStop()
      }
      initEngine(io, games)
      resolve({ io, stop })
    })
    .on('error', (err) => {
      logerror(`Engine error: ${err.message}`)
      reject(err)
    })
  })
  return promise
}
