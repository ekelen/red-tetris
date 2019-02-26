/* eslint-env node, mocha */
import chai from 'chai'
import { configureStore } from '../helpers/client'
import { alert } from '../../src/client/actions/alert';
import { ALERT_POP, CREATE_GAME_SUCCESS, ENTER_GAME_FAIL } from '../../src/common/constants';
import reducer from '../../src/client/reducers/alert';

chai.should()
const expect = chai.expect

const initialState = {
  message: '',
  errmsg: ''
}

describe('alert reducer', () => {
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
      CREATE_GAME_SUCCESS: ({ getState, action }) => {
        console.log('action: ', action);
        const state = getState()
        const expected = 'You have created a game!'
        console.log('state: ', state);
        expect(state.message).to.equal(expected)
        done()
      }
    })
    store.dispatch({ type: CREATE_GAME_SUCCESS })
  })

  it('updates errmsg on ENTER_GAME_FAIL', done => {
    const store = configureStore(reducer, null, initialState, {
      ENTER_GAME_FAIL: ({ getState, action }) => {
        console.log('action: ', action);
        const state = getState()
        expect(state.errmsg).not.to.be.empty
        done()
      }
    })
    store.dispatch({ type: ENTER_GAME_FAIL })
  })
})
