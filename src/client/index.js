import React from 'react'
import ReactDom from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { socketMiddleWare } from './middleware/socketMiddleWare'
import reducer from './reducers'
import io from 'socket.io-client'
import params from '../../params'
import Root from './components/Root'

const initialState = {}

const socket = io(params.server.url)

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(thunk, socketMiddleWare(socket))
)

ReactDom.render((
  <Provider store={store}>
    <Root />
  </Provider>
), document.getElementById('tetris'))
