import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import Game from '../containers/Game';

const Root = () => (
	<Router>
		<div className='tetris'>
			<Route path="/" component={Game} />
			{/* TODO bonus: Menu on landing page*/}
		</div>
  	</Router>
)

export default Root