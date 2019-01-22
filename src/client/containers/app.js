import React from 'react'
import { connect } from 'react-redux'
import '../styles/app.scss'
import Game from '../components/Game';
import { START_SINGLE_PLAYER_GAME } from '../actions/game';
import Menu from '../components/Menu';

const App = ({ alive, board, gameTimerStarted, message, notInRoom, startSinglePlayer }) => {
  return (
    <div className={'tetris'}>
      {/* display menu screen if game not started, else game */}
      <span>{message}</span>
      {notInRoom && <Menu startSinglePlayer={startSinglePlayer} />}
      {!notInRoom && <Game alive={alive} board={board} gameTimerStarted={gameTimerStarted} />}
    </div>
  )
}

const mapStateToProps = (state) => {

  return {
    message: state.alert.message,
    alive: state.game.alive,
    board: state.game.board,
    gameTimerStarted: state.game.gameTimerStarted, // has game started?
    notInRoom: state.game.notInRoom, // has not joined/started any game
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startSinglePlayer: () => {
      dispatch({ type: START_SINGLE_PLAYER_GAME })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

