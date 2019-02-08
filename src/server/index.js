import fs from 'fs'
import debug from 'debug'
import { initEngine } from './engine';

const logerror = debug('tetris:error'), loginfo = debug('tetris:info')

export function create(params) {
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
      loginfo(`tetris listen on ${params.url}`)

      const io = require('socket.io')(app)
      const stop = (onStop) => {
        io.close()
        app.close(() => {
          app.unref()
        })
        loginfo('Engine stopped.')
        onStop()
      }

      initEngine(io)
      resolve({ stop })
    })
    .on('error', (err) => {
      const stop = (onStop) => {
        app.close(() => {
          app.unref()
        })

        logerror(`Engine stopped due to error: ${err.message}`)
        onStop()
      }
      reject({ err, stop })
    })
  })
  return promise
}
