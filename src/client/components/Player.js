// my board
import React from 'react'
import '../styles/board.scss'

const splitBoard = board => (
  board.filter((row, i) => i > 3)
)

const Player = ({ board }) => {
  return (
    <div className={'board large'}>
      <span>MY BOARD</span>
      {splitBoard(board).map((row, i) => (
        <div key={i} className={'row'}>
          {row.map((cell, i) => (
            <div key={i} className={`cell${cell}`} />
          ))}
        </div>
      ))}
      {/* display board (different design if alive or not) */}
    </div>
  )
}

export default Player
