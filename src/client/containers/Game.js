import React from 'react'
import Player from '../components/Player'
import Ghost from '../components/Ghost'
import { connect } from 'react-redux'
import { startGameTimer, stopGameTimer } from '../actions/update'
import { startGame } from '../actions/server'
import '../styles/game.scss'
import Buttons from '../components/Buttons';

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
  startGameTimer,
  stopGameTimer,
  waiting
}) => {
  return (
    <div className={'game'}>
      {(offlineMode || activePlayers[0].playerName === playerName) &&
        <Buttons {...{ inProgress, startGame }} />
      }

    {(!waiting && inProgress) &&
      <div className={'player'}>
      <Player
        alive={alive}
        board={board}
        offlineMode={offlineMode}
        pieces={pieces}
        startGameTimer={startGameTimer}
        stopGameTimer={stopGameTimer} />
    </div>}
    {waiting && (inProgress ?
       (<div>Waiting for game to end, then maybe you can join...</div>) :
        (<div>Game is full (or should be), waiting for other players to leave...</div>))
    }
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
  board: state.board,
})

const mapDispatchToProps = {
  startGame,
  startGameTimer,
  stopGameTimer
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)