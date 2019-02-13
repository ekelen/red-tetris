import React from 'react'
import '../styles/ghost.scss'

const Ghost = ({ alive, board, playerName }) => {
  return (
    <div className={`ghostBoard ${alive ? 'alive' : 'dead'}`}>
      {board.map((row, i) => (
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
