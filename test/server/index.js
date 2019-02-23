/* eslint-env node, mocha */
import chai from "chai"
import * as server from '../../src/server/index'

chai.should()

describe('server.create', () => {
  it('returns a promise', done => {
    const result = server.create({}, [])
    result.should.be.instanceOf(Promise)
    done()
  })

  it('rejects if given bad server params', done => {
    server.create({ host: '1.1.1.1', port: 80 }, [])
      .then(
        onResolve => done(new Error('Should not have worked')),
        onReject => done())
  })

  it('resolves if given good server params', done => {
    server.create({ host: '0.0.0.0', port: 4242 }, [])
      .then((onResolve) => {
        onResolve.stop(done);
      },
        err => done(err))
  })
})