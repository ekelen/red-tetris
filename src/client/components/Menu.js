import React from 'react'

// Display choices (single player vs multiplayer)

const Menu = ({ startSinglePlayer }) => {
  return (
    <div className={'menu'}>
      <button onClick={startSinglePlayer}>Start Singleplayer Game</button>
    </div>
  )
}

export default Menu
