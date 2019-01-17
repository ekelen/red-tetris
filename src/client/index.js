import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'                                                                                                                                                    
import {storeStateMiddleWare} from './middleware/storeStateMiddleWare'
import {socketMiddleWare} from './middleware/socketMiddleWare'
import reducer from './reducers'
import App from './containers/app'
import {alert} from './actions/alert'
import io from 'socket.io-client'
import params from "../../params"

const initialState = {}

const socket = io(params.server.url)

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(thunk, createLogger(), socketMiddleWare(socket))
)

ReactDom.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('tetris'))

store.dispatch(alert('Soon, will be here a fantastic Tetris ...'))
store.dispatch({type: 'server/ping'})
