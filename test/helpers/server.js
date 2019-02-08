import * as server from '../../src/server/index'

// onServerStart = (err: Error, server: Server) => any
export const startServer = (params, onServerStart) => {
  server.create(params)
    .then(server => onServerStart(null, server))
    .catch(err => onServerStart(err))
}
