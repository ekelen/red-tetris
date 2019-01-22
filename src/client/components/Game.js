import React from 'react'
import Player from './Player'
import Ghost from './Ghost'

const Game = ({ alive, board, gameTimerStarted, opponents, pieces }) => (
	<div>
		<div className={'opponents'}>
			{opponents && opponents.map(opponent => (<Ghost board={opponent.board} alive={opponent.alive} />))}
		</div>
		<Player alive={alive} board={board} gameTimerStarted={gameTimerStarted} pieces={pieces} />
	</div>
)

export default Game