import React from 'react'
import Player from '../components/Player'
import Ghost from '../components/Ghost'
import lifecycle from 'react-pure-lifecycle'
import { connect } from 'react-redux'
import { startTimer, stopTimer } from '../actions/timer'

const methods = {
  componentDidMount({startTimer}) {
	  startTimer()
  }
}

const Game = ({opponents, alive, pieces, board, stopTimer}) => (
	<div>
		<div className={'opponents'}>
			{opponents && opponents.map(opponent => (<Ghost board={opponent.board} alive={opponent.alive} />))}
		</div>
		<Player alive={alive} board={board} pieces={pieces} />
		<div><button onClick={stopTimer}>Stop Timer</button></div>
	</div>
)

const mapStateToProps = state => ({
	...state.game
})

const mapDispatchToProps = {
	startTimer,
	stopTimer
}

const withLifecycleHooks = lifecycle(methods)(Game) 
export default connect(mapStateToProps, mapDispatchToProps)(withLifecycleHooks)