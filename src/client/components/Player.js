// my board
import React from 'react'
import '../styles/board.scss'

const Player = ({ alive, board, gameTimerStarted }) => (
	<div className={'board large'}>
		<span>MY BOARD</span>
		{board.map((row, i) => (
			<div key={i} className={'row'}>
				{row.map((cell, i) => (
					<div key={i} className={'cell'} />
				))}
			</div>
		))
		}
		{/* display board (different design if alive or not) */}
	</div>
)

export default Player
