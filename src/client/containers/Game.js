import React from 'react'
import Player from '../components/Player'
import Ghost from '../components/Ghost'
import lifecycle from 'react-pure-lifecycle'
import { connect } from 'react-redux'
import { startGameTimer, stopGameTimer } from '../actions/update'
import { startGame } from '../actions/server'
import '../styles/game.scss'
import Buttons from '../components/Buttons';

const methods = {
  componentDidMount({ offlineMode, startGameTimer }) {
    if (offlineMode) startGameTimer()
  }
}

const Game = ({
  alive,
  board,
  offlineMode,
  opponents,
  pieces,
  playerName,
  playerNames,
  started,
  startGame
}) => {
  return (
    <div className={'game'}>
      {(offlineMode || playerNames[0] === playerName) &&
        <Buttons {...{ started, startGame }} />
      }

    <div className={'player'}>
      <Player alive={alive} board={board} pieces={pieces} />
    </div>
      {(opponents.length > 0) && (
        <div className={'opponents'}>
          {opponents.map((opponent, i) => (<Ghost
            alive={opponent.alive}
            board={opponent.ghost}
            key={i}
            playerName={opponent.playerName}
        />
        ))}
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
  startGameTimer,
  stopGameTimer
}

const withLifecycleHooks = lifecycle(methods)(Game)
export default connect(mapStateToProps, mapDispatchToProps)(withLifecycleHooks)