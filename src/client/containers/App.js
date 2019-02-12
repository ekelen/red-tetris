import React from 'react'
import Game from './Game'
import Loading from '../components/Loading'
import { connect } from 'react-redux'
import lifecycle from 'react-pure-lifecycle'
import { parseURL } from '../actions/parse'
import Message from '../components/Message';

const methods = {
  componentDidMount({ location, parseURL }) {
    parseURL(location.pathname)
  }
}

const App = ({ errmsg, message, urlParsed }) => (
  <div>
     <Message {...{ errmsg, message }} />
    {(!errmsg && urlParsed) && <Game />}
  </div>
)

const mapStateToProps = state => ({
  ...state.game,
  errmsg: state.alert.errmsg,
  message: state.alert.message
})

const mapDispatchToProps = {
  parseURL
}

const withLifecycleHooks = lifecycle(methods)(App)
export default connect(mapStateToProps, mapDispatchToProps)(withLifecycleHooks)
