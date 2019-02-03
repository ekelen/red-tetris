import React from 'react'
import Game from './Game'
import Loading from '../components/Loading'
import { connect } from 'react-redux'
import lifecycle from 'react-pure-lifecycle'
import { startTimer } from '../actions/game'
import { parseURL } from '../actions/parse'

const methods = {
  componentDidMount({ location, parseURL }) {
    parseURL(location.pathname)

    // TODO: Start timer ----redux action
    // TODO: join a room if well formated #<roomid>[<playername>]
    // TODO: Start timer when everyone arrives----redux action
  }
}

// TODO: Proper usage message
const App = ({ currNPlayers, nPlayers, started, urlInputError }) => (
  started ?
  <Game /> :
    urlInputError ?
    <div>{'ERROR: Expected multiplayer URL format: localhost:8080/#<num_users>-<room_name>[<player_name>] \nSingle player: localhost:8080/'}</div>
    : <Loading currNPlayers={currNPlayers} nPlayers={nPlayers}/>
)

const mapStateToProps = state => ({
  started: state.game.started,
  nPlayers: state.game.nPlayers,
  currNPlayers: state.game.currNPlayers,
  urlInputError: state.game.urlInputError
})

const mapDispatchToProps = {
    parseURL
}

const withLifecycleHooks = lifecycle(methods)(App)
export default connect(mapStateToProps, mapDispatchToProps)(withLifecycleHooks)
