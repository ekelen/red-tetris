export const socketMiddleWare = socket => () => next => action => {
  // Socket waits for event from server
  socket.on('action', action => {
    // console.log('Received an action over socket connection: ', action)
    return next(action)
  })

  // Continue dispatching normal UI-triggered event
  // console.log('Passing through socket middleware with action : ', action)
  if (socket && action.type && (action.type.startsWith('server/') || action.type.startsWith('SERVER')))
    socket.emit('action', action)
  else
    return next(action)
}
