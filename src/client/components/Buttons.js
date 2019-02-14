import React from 'react'
import '../styles/buttons.scss'

const Buttons = ({ started, startGame }) => (
  <div className={'buttons'}>
    <button onClick={startGame} disabled={started}>Start Game</button>
  </div>
)

export default Buttons
