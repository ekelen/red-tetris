import React from 'react'
import { NavLink } from 'react-router-dom'

// Display choices (single player vs multiplayer)
// TODO: decide if container or not (maybe move it to components)

const Menu = () => {
  return (
    <div className={'menu'}>
      <NavLink to='/singlePlayer'>Start Singleplayer Game</NavLink>
    </div>
  )
}

export default Menu
