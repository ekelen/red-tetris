import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import App from '../containers/App';

const Root = () => (
	<Router hashType='noslash'>
		<div className='tetris'>
			<Route path="/" component={App} />
			{/* TODO bonus: Menu on landing page*/}
		</div>
  	</Router>
)

export default Root