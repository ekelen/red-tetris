import params from '../../params'
import * as server from './index'
global.__games = []

server.create(params.server, __games)
  .then(() => server.loginfo('Server created...'))