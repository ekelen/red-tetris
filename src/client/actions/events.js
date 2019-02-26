import { 
  handleMovement, 
  handleRotation, 
  handlePieceDown,
  handleInstantLock
} from './update'

export const LEFT = 37
export const UP = 38
export const RIGHT = 39
export const DOWN = 40
export const SPACE = 32

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
    case SPACE:
      e.preventDefault()
      dispatch(handleInstantLock())
      break
  }
}