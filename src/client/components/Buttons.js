import React from 'react'
import '../styles/buttons.scss'

const Buttons = ({ inProgress, startGame }) => (
  <div className={'buttons'}>
    <button onClick={startGame} disabled={inProgress}>Start Game</button>
  </div>
)

export default Buttons
