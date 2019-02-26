/* eslint-env node, mocha */
import chai from "chai"
import Piece from "../../src/server/Piece.class";

chai.should()
const expect = chai.expect

describe('Piece properties', () => {
  it('has a constructor that returns a new Piece with no props', () => {
    const piece = new Piece()
    expect(piece).to.be.empty
  })

  it('has a static method that returns an array', () => {
    const lineup = Piece.generateLineup(50)
    expect(lineup).to.be.an('array').that.has.lengthOf(50)
  })
})
