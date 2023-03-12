export const useFilter = (arr, find, match) => {
  return arr.filter(obj => {
      return obj[find] === match
  })
}

export const useFilterId = (arr, id) => {
  return arr.filter(obj => {
      return obj.id === id
  })
}

export const useFilterIsEnabled = (arr, id) => {
  return arr.filter(obj => {
      return obj.is_enabled === id
  })
}

export const getUnique = (arr, key) => {
  const newMap = new Map();
  arr.forEach((item) => newMap.set(item[key], item));

  return [...newMap.values()]
}