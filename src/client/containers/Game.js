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
  activePlayers,
  board,
  offlineMode,
  opponents,
  pieces,
  playerName,
  inProgress,
  startGame,
  waiting
}) => {
  return (
    <div className={'game'}>
      {(offlineMode || activePlayers[0].playerName === playerName) &&
        <Buttons {...{ inProgress, startGame }} />
      }

    {!waiting && <div className={'player'}>
      <Player alive={alive} board={board} pieces={pieces} />
    </div>}
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
  ...state.player,
  alive: state.player.alive,
  activePlayers: state.game.activePlayers,
  board: state.board,
  playerName: state.player.playerName,
  roomName: state.game.roomName
})

const mapDispatchToProps = {
  startGame,
  startGameTimer,
  stopGameTimer
}

const withLifecycleHooks = lifecycle(methods)(Game)
export default connect(mapStateToProps, mapDispatchToProps)(withLifecycleHooks)