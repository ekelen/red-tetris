// my board
import React from 'react'
import lifecycle from 'react-pure-lifecycle'
import '../styles/board.scss'

const splitBoard = board => (
  board.filter((row, i) => i > 3)
)

const methods = {
  componentDidMount({ startGameTimer }) {
    startGameTimer()
  },
  componentWillUnmount({ stopGameTimer }) {
    stopGameTimer()
  }
}

const Player = ({ alive, board }) => {
  return (
    <div className={alive ? 'playerBoard' : 'playerBoard dead'}>
      {splitBoard(board).map((row, i) => (
        <div key={i} className={'playerRow'}>
          {row.map((cell, i) => (
            <div key={i} className={alive || cell < 1 || cell === 8 ? `cell${cell}` : 'cellDead' } />
          ))}
        </div>
      ))}
      {/* display board (different design if alive or not) */}
    </div>
  )
}

const withLifecycleHooks = lifecycle(methods)(Player)
export default withLifecycleHooks
