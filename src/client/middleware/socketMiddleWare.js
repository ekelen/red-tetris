export const socketMiddleWare = socket => ({ dispatch }) => {
  if (socket)
    socket.on('action', dispatch)
  return next => action => {
    if (socket && action.type && action.type.startsWith('SERVER'))
      socket.emit('action', action)
    return next(action)
  }
}
