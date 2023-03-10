/* eslint-disable */
const abilityList = ['add', 'edit', 'delete', 'export', 'import']

function abilityDetails(controlHeader) {
  let returns = {}
  if (controlHeader) {
    if (controlHeader.toLowerCase() == 'controls') {
      if (abilityList.includes('edit') == false && abilityList.includes('delete') == false) {
        returns['display_table_header'] = true
      }
    }
  }
  return returns
}

export default abilityDetails
