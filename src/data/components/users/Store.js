/* eslint-disable */
import { createAction, createReducer } from '@reduxjs/toolkit'

const LIST = 'CAMPAIGN_LIST'
const CREATE = 'CAMPAIGN_CREATE'
const LOAD = 'CAMPAIGN_LOAD'
const DELETE = 'CAMPAIGN_DELETE'
const INIT = 'CAMPAIGN_INIT'
const PROCESS = 'CAMPAIGN_PROCESS'
const LIST_PAGINATED = 'LIST_PAGINATED'
const CLEAR = 'CAMPAIGN_CLEAR'

export const campaignList = createAction(LIST)
export const campaignCreate = createAction(CREATE)
export const campaignLoad = createAction(LOAD)
export const campaignDelete = createAction(DELETE)
export const campaignInit = createAction(INIT)
export const campaignProcess = createAction(PROCESS)
export const campaignListPaginated = createAction(LIST_PAGINATED)
export const campaignClear = createAction(CLEAR)

export const initialState = {
  title: 'Campaign',
  list: [],
  listPaginated: [],
  item: {},
  data: {},
  mode: '',
  status: false,
}

const reducer = createReducer(initialState, {
  [campaignList]: (state, action) => {
    state.list = action.payload
  },
  [campaignListPaginated]: (state, action) => {
    state.listPaginated = action.payload
  },
  [campaignCreate]: (state, action) => {
    state.mode = 'Create'
    state.status = false
    state.item = {}
    state.data = {}
  },
  [campaignLoad]: (state, action) => {
    state.mode = 'Update'
    state.status = false
    state.item = action.payload
    state.data = {}
  },
  [campaignDelete]: (state, action) => {
    state.mode = 'Delete'
    state.status = false
  },
  [campaignInit]: (state, action) => {
    state.data = action.payload
  },
  [campaignProcess]: (state, action) => {
    state.status = action.payload
  },
  [campaignClear]: (state, action) => {
    state.status = false
    state.mode = ''
  },
})

export default reducer
