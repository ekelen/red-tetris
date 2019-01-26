import React from 'react'
import Player from '../components/Player'
import Ghost from '../components/Ghost'
import { connect } from 'react-redux'

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

export default connect(mapStateToProps, null)(Game)