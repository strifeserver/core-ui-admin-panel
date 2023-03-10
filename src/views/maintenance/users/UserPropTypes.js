/* eslint-disable */
import PropTypes from 'prop-types'

export const DefaultColumnFilterPropTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.string,
    preFilteredRows: PropTypes.array.isRequired,
    setFilter: PropTypes.func.isRequired,
  }).isRequired,
}

export const GlobalFilterPropTypes = {
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
}

export const SelectColumnFilterPropTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.string,
    setFilter: PropTypes.func.isRequired,
    preFilteredRows: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
}
export const NumberRangeColumnFilterPropTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.array,
    preFilteredRows: PropTypes.array.isRequired,
    setFilter: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
}
export const TablePropTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        Header: PropTypes.string,
        accessor: PropTypes.string,
        columnSize: PropTypes.number,
        Filter: PropTypes.elementType,
        Cell: PropTypes.elementType,
      })
    ).isRequired,
  };

export const CellPropTypes = {
  value: PropTypes.any,
  row: PropTypes.object,
  column: PropTypes.object,
}
