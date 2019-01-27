export const START_SINGLE_PLAYER_GAME = 'START_SINGLE_PLAYER_GAME'

export const EMPTY_BOARD = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

// TODO: finish and start using
const _parseURL = (afterHash) => {
  const openBracketPosition = afterHash.indexOf("[", 1)
  const closeBracketPosition = afterHash.indexOf("]", openBracketPosition)
  if (openBracketPosition < 0 || closeBracketPosition !== afterHash.length) return ({ roomName: '', playerName: '' })

  const playerName = afterHash.slice(1, openBracketPosition)
  const roomName = afterHash.slice(openBracketPosition + 1, closeBracketPosition)

  // TODO: sanitize usernames
  return ({ roomName, playerName })
}

export const parseURL = (urlMatchProps) => {
  console.log('urlMatchProps', urlMatchProps)
  switch (urlMatchProps.url) {
    case '/':
      return ({type: START_SINGLE_PLAYER_GAME})
    default:
      return ({type: 'MOCK__START_MULTIPLAYER_GAME'})
  }
}
