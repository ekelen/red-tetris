import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import App from '../containers/App';
import '../styles/root.scss'

const Root = () => (
  <Router hashType='noslash'>
    <div className={'page'}>
      <Route component={App} path='/' />
      {/* TODO bonus: Menu on landing page*/}
    </div>
  </Router>
)

export default Root