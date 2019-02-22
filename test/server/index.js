/* eslint-env node, mocha */
import chai from "chai"
import rootReducer from '../../src/client/reducers'
import io from 'socket.io-client'
import params from '../../params'
import { parseURL } from '../../src/client/actions/parse'
import { configureStore } from '../helpers/client'
import * as server from '../../src/server/index'
import { ping } from '../../src/client/actions/server';
import { cloneDeep } from 'lodash'
import { SERVER_START_GAME, SERVER_PLAYER_DIES } from '../../src/common/constants';

chai.should()

describe('server.create', () => {
  it('returns a promise', done => {
    const result = server.create({}, [])
    result.should.be.instanceOf(Promise)
    done()
  })

  it('rejects if given bad server params', done => {
    server.create({ host: '1.1.1.1', port: 80 }, [])
      .then((onResolve) => done(new Error('Should not have worked')),
        onReject => { done() })
  })

  it('resolves if given good server params', done => {
    server.create({ host: '0.0.0.0', port: 4242 }, [])
      .then((onResolve) => {
        onResolve.stop(done);
      },
        err => { done(err) })
  })
})