import React from 'react'
import Game from './Game'
import { connect } from 'react-redux'
import lifecycle from 'react-pure-lifecycle'
import { parseURL } from '../actions/parse'
import Message from '../components/Message';
import '../styles/app.scss'

const methods = {
  componentDidMount({ location, parseURL }) {
    parseURL(location.pathname)
  }
}

const App = ({ errmsg, message, urlParsed }) => (
    <div className={'app'}>
      <div className={'status'}>
        <Message {...{ errmsg, message }} />
        </div>
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
