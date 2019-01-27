import React from 'react'
import Game from './Game'
import Loading from '../components/Loading'
import { connect } from 'react-redux'
import lifecycle from 'react-pure-lifecycle'
import { parseURL, startTimer } from '../actions/game'

const methods = {
  componentDidMount({match, parseURL}) {
		parseURL(match);

		// TODO: nothing after # in URL : start single player mode
			// TODO: Start timer ----redux action
		// TODO: room id after # in URL :
			// TODO: join a room if well formated #<roomid>[<playername>]
			// TODO: Start timer when everyone arrives----redux action
	}
}

const App = ({started}) => (
	started ? 
	<Game /> :
	<Loading />
)

const mapStateToProps = state => ({
	started: state.game.started
})

const mapDispatchToProps = {
    parseURL
}

const withLifecycleHooks = lifecycle(methods)(App)
export default connect(mapStateToProps, mapDispatchToProps)(withLifecycleHooks)
