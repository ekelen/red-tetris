export const socketMiddleWare = socket => ({ dispatch }) => {
  if (socket)
    socket.on('action', dispatch)
  return next => action => {
    if (socket && action && action.type && action.type.startsWith('SERVER'))
      socket.emit('action', action)
    console.log('action: ', action);
    return next(action)
  }
}
