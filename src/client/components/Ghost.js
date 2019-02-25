import React from 'react'
import '../styles/ghost.scss'

const getFormatedGhost = board => {
    const slicedBoard = board.slice(4)
    const formatedBoard = slicedBoard.map(row => row.map(e => e > 0 ? 1 : 0))
    return formatedBoard
}

const Ghost = ({ alive, board, playerName }) => {
  return (
    <div className={`ghostBoard ${alive ? 'alive' : 'dead'}`}>
      {getFormatedGhost(board).map((row, i) => (
        <div className={'ghostRow'} key={i} >
          {row.map((cell, j) => (
            <div className={`ghostCell cell${cell}`} key={j} />
          ))}
        </div>
      ))}
      <p>{`${playerName}`}</p>
    </div>
  )
}

export default Ghost
