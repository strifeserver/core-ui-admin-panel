/* eslint-disable */
export const filters = {
  contains: (value, filterValue) => {
    return value.toLowerCase().includes(filterValue.toLowerCase())
  },
  equals: (value, filterValue) => {
    return value.toLowerCase() === filterValue.toLowerCase()
  },
}
