/* eslint-disable */
const initialState = {
  columns: [],
  rowData: [],
}

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COLUMNS':

      return { ...state, columns: action.payload }
    case 'SET_ROW_DATA':
      return { ...state, rowData: action.payload }
    default:
      return state
  }
}

export default dataReducer
