import React from 'react'
import Player from '../components/Player'
import Ghost from '../components/Ghost'
import lifecycle from 'react-pure-lifecycle'
import { connect } from 'react-redux'
import { startGame, stopGame } from '../actions/update'

const methods = {
  componentDidMount({startGame}) {
	  startGame()
  }
}

const Game = ({opponents, alive, pieces, board, stopGame}) => {
  return (
    <div>
      <div className={'opponents'}>
        {opponents && opponents.map(opponent => (<Ghost board={opponent.board} alive={opponent.alive} />))}
      </div>
      <Player alive={alive} board={board} pieces={pieces} />
  		<div><button onClick={stopGame}>Stop Timer</button></div>
    </div>
  )
}

const mapStateToProps = state => ({
	...state.game, board: state.board
})

const mapDispatchToProps = {
	startGame,
	stopGame
}

const withLifecycleHooks = lifecycle(methods)(Game) 
export default connect(mapStateToProps, mapDispatchToProps)(withLifecycleHooks)