import React from 'react'
import Player from '../components/Player'
import Ghost from '../components/Ghost'
import { connect } from 'react-redux'
import lifecycle from 'react-pure-lifecycle';

const methods = {
  componentDidMount(props) {
    console.log('I mounted! Here are my props: ', props);
	// TODO: nothing after # in URL : start single player mode
		// TODO: Start timer ----redux action
	// TODO: room id after # in URL : 
		// TODO: join a room if well formated #<roomid>[<playername>]
		// TODO: Start timer when everyone arrives----redux action
  }
}

const Game = ({ alive, board, gameTimerStarted, opponents, pieces }) => (
	<div>
		<div className={'opponents'}>
			{opponents && opponents.map(opponent => (<Ghost board={opponent.board} alive={opponent.alive} />))}
		</div>
		<Player alive={alive} board={board} gameTimerStarted={gameTimerStarted} pieces={pieces} />
	</div>
)

const mapStateToProps = state => {
  return {
    message: state.alert.message,
    alive: state.game.alive,
    board: state.game.board,
    gameTimerStarted: state.game.gameTimerStarted, // has game started?
	opponents: [], //TODO: unmock
	pieces: [] //TODO: unmock
  }
}

const withLifecycleHooks = lifecycle(methods)(Game)
export default connect(mapStateToProps, null)(withLifecycleHooks)