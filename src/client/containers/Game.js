import React from 'react'
import Player from '../components/Player'
import Ghost from '../components/Ghost'
import lifecycle from 'react-pure-lifecycle'
import { connect } from 'react-redux'
import { startGame, stopGame } from '../actions/update'
import '../styles/game.scss'

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
    <div className={'game'}>
    <div className={'buttons'}>
      <button onClick={stopGame} disabled={!started}>Stop Timer</button>
        <button onClick={startGame} disabled={started}>Start Game with {opponents.length + 1} Players</button>
      </div>

      <div className={'player'}>
      <Player alive={alive} board={board} pieces={pieces} />
      </div>
        {(opponents.length > 0) && (
          <div className={'opponents'}>
          {opponents.map((opponent, i) => (<Ghost alive={opponent.alive} board={opponent.ghost} playerName={opponent.playerName} key={i} />))}
        </div>
        )}
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