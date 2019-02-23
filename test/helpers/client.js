import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

export const configureStore = (reducer, socket, initialState, types) => createStore(
  reducer,
  initialState,
  applyMiddleware(
    thunk,
    myMiddleware(types),
    socketIoMiddleWare(socket)
  )
)

const isFunction = arg => (typeof arg === 'function')

const myMiddleware = (types = {}) => {
  const fired = {}
  return store => next => action => {
    const result = next(action)
    const cb = types[action.type]
    if (cb && !fired[action.type]) {
      if (!isFunction(cb)) throw new Error('action\'s type value must be a function')
      fired[action.type] = true
      cb({ getState: store.getState, dispatch: store.dispatch, action })
    }
    return result
  }
}

const socketIoMiddleWare = socket => ({ dispatch }) => {
  if (socket)
    socket.on('action', dispatch)
  return next => action => {
    if (socket && action.type && action.type.startsWith('SERVER'))
      socket.emit('action', action)
    return next(action)
  }
}
