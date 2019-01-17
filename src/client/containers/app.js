import React from 'react'
import { connect } from 'react-redux'


const App = ({message}) => {
  return (
	//	display menu screen if game not started
	//	display play screen otherwise
    <span>{message}</span>
  )
}

const mapStateToProps = (state) => {
  return {
    message: state.message
  }
}
export default connect(mapStateToProps, null)(App)


