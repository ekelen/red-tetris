import React from 'react'
import Player from '../components/Player'
import Ghost from '../components/Ghost'
import lifecycle from 'react-pure-lifecycle'
import { connect } from 'react-redux'
import { startTimer } from '../actions/timer'

const methods = {
  componentDidMount({startTimer}) {
	  startTimer()
  }
}

const Game = ({opponents, alive, pieces, board}) => (
	<div>
		<div className={'opponents'}>
			{opponents && opponents.map(opponent => (<Ghost board={opponent.board} alive={opponent.alive} />))}
		</div>
		<Player alive={alive} board={board} pieces={pieces} />
	</div>
)

const mapStateToProps = state => ({
	...state.game
})

const mapDispatchToProps = {
	startTimer
}

const withLifecycleHooks = lifecycle(methods)(Game) 
export default connect(mapStateToProps, mapDispatchToProps)(withLifecycleHooks)