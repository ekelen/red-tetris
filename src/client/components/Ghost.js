import React from 'react'
import '../styles/board.scss'

// The ghost board (opponents boards)

const Ghost = ({ alive, board }) => (
  <div className={'board ghost'}>
    {/* display board (different design if alive or not) */}
    <span> GHOST HERE!</span>
  </div>
)

export default Ghost
