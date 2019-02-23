import { handleMovement, handleRotation, handlePieceDown } from './update'

const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40

export const handleEvents = dispatch => e => {
  switch (e.keyCode) {
    case LEFT:
      e.preventDefault()
      dispatch(handleMovement(-1))
      break
    case RIGHT:
      e.preventDefault()
      dispatch(handleMovement(1))
      break
    case UP:
      e.preventDefault()
      dispatch(handleRotation())
      break
    case DOWN:
      e.preventDefault()
      dispatch(handlePieceDown())
      break
  }
}