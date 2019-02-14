import React from 'react'
import '../styles/buttons.scss'

const Buttons = ({ started, startGame, stopGame }) => (
  <div className={'buttons'}>
    <button onClick={stopGame} disabled={!started}>Stop Timer</button>
    <button onClick={startGame} disabled={started}>Start Game</button>
  </div>
)

export default Buttons
