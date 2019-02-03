import React from 'react'

const Loading = ({ currNPlayers, nPlayers }) => (
	<div>
		Loading...
		{ nPlayers > 1 && <span>Multiplayer game being prepared...</span> }
		{ (currNPlayers < nPlayers) && <span>Waiting for all the players...</span>}
	</div>
)

export default Loading