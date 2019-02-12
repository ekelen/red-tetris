import React from 'react'
import '../styles/board.scss'

const Ghost = ({ alive, board, playerName }) => (
  <div className={`board ghost ${alive ? 'alive' : 'dead'}`}>
    <span>{`GHOST ${playerName} HERE!`}</span>
  </div>
)

export default Ghost
