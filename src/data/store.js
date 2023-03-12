/* eslint-disable */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import campaign from './components/users/Store'

const rootReducer = combineReducers({
  campaign: campaign,
})

const middleware = []

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  storeEnhancers(applyMiddleware(...middleware, thunk, logger)),
)

export default store
