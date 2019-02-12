import React from 'react'
import Player from '../components/Player'
import Ghost from '../components/Ghost'
import lifecycle from 'react-pure-lifecycle'
import { connect } from 'react-redux'
import { startGame, stopGame } from '../actions/update'

const methods = {
  componentDidMount({ offlineMode, startGame }) {
    if (offlineMode) startGame()
  }
}

const Game = ({
  alive,
  board,
  offlineMode,
  opponents,
  pieces,
  started,
  startGame,
  stopGame
}) => {
  return (
    <div>
      <div><button onClick={stopGame} disabled={!started}>Stop Timer</button>
        {!offlineMode && (<button onClick={startGame} disabled={started}>Start Game with {opponents.length + 1} Players</button>)}
      </div>
      <div className={'opponents'}>
        {opponents && opponents.map((opponent, i) => (<Ghost board={opponent.ghost} key={i} alive={opponent.alive} />))}
      </div>
      <Player alive={alive} board={board} pieces={pieces} />

    </div>
  )
}

const mapStateToProps = state => ({
  ...state.game,
  board: state.board
})

const mapDispatchToProps = {
  startGame,
  stopGame
}

const withLifecycleHooks = lifecycle(methods)(Game)
export default connect(mapStateToProps, mapDispatchToProps)(withLifecycleHooks)