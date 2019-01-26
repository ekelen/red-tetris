import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import Game from '../containers/Game';
import Menu from '../containers/Menu';

const Root = () => (
	<Router>
		<div className='tetris'>
			<Route exact path="/" component={Menu} />
			<Route exact path="/singlePlayer" component={Game} />
		</div>
  	</Router>
)

export default Root