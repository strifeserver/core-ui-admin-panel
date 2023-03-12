/* eslint-disable */
import { createAction, createReducer } from '@reduxjs/toolkit'

const LOADING = 'LOADING'

export const loading = createAction(LOADING)

export const initialState = {
  loading: false,
}

const reducer = createReducer(initialState, {
  [loading]: (state, action) => {
    console.log(action)
    state.loading = action.payload
  },
})

export default reducer
