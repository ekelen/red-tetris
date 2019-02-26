import React from 'react'
import '../styles/ghost.scss'
import { HIDDEN_BOARD_LEN } from '../reducers/board'

const getFormatedGhost = board => {
  const slicedBoard = board.slice(HIDDEN_BOARD_LEN)
  const formatedBoard = slicedBoard.map(row => row.map(e => (
    e > 0 ? 1 : 0
  )))
  return formatedBoard
}

const Ghost = ({ alive, board, playerName }) => (
  <div className={`ghostBoard ${alive ? 'alive' : 'dead'}`}>
    {getFormatedGhost(board).map((row, i) => (
      <div className={'ghostRow'} key={i} >
        {row.map((cell, j) => (
          <div className={`ghostCell cell${cell} ${alive || cell === 0 ? 'alive' : 'dead'}`} key={j} />
        ))}
      </div>
    ))}
    <p className={alive ? 'alive' : 'dead'}>{`${playerName}`}</p>
  </div>
)

export default Ghost
