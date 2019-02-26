/* eslint-env node, mocha */
import chai from 'chai'
import { configureStore } from '../helpers/client'
import { alert } from '../../src/client/actions/alert';
import { CREATE_GAME_SUCCESS, ENTER_GAME_FAIL } from '../../src/common/constants';
import reducer from '../../src/client/reducers/alert';

chai.should()

const initialState = {
  message: '',
  errmsg: ''
}

describe('alert reducer', () => {
  const expect = chai.expect

  it('updates message on ALERT_POP', done => {
    const store = configureStore(reducer, null, initialState, {
      ALERT_POP: ({ getState }) => {
        const state = getState()
        const expected = 'ALERT!'
        expect(state.message).to.equal(expected)
        done()
      }
    })
    store.dispatch(alert('ALERT!'))
  })

  it('updates message on CREATE_GAME_SUCCESS', done => {
    const store = configureStore(reducer, null, initialState, {
      CREATE_GAME_SUCCESS: ({ getState }) => {
        const state = getState()
        const expected = 'You have created a game!'
        expect(state.message).to.equal(expected)
        done()
      }
    })
    store.dispatch({ type: CREATE_GAME_SUCCESS })
  })

  it('updates errmsg on ENTER_GAME_FAIL', done => {
    const store = configureStore(reducer, null, initialState, {
      ENTER_GAME_FAIL: ({ getState }) => {
        const state = getState()
        expect(state.errmsg).to.be.a('string')
        done()
      }
    })
    store.dispatch({ type: ENTER_GAME_FAIL })
  })
})
