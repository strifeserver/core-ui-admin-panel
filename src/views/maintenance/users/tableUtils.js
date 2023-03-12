/* eslint-disable */
import React from 'react'
import { matchSorter } from 'match-sorter'
import { CFormInput, CFormSelect } from '@coreui/react'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import abilityDetails from '../../../components/abilities/ability'

export const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter,accessor },
  setSearch,
}) => {

    if(filterValue){
        console.log('SEARCH',accessor)
        console.log('VALUE OF',filterValue)
    }
  return (
    <CFormInput
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined)
        setSearch(filterValue)
      }}
      placeholder={`Search ${preFilteredRows.length} records...`}
    />
  )
}

export const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  const options = React.useMemo(
    () => [...new Set(preFilteredRows.map((row) => row.values[id]))],
    [id, preFilteredRows],
  )

  return (
    <CFormSelect value={filterValue} onChange={(e) => setFilter(e.target.value || undefined)}>
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </CFormSelect>
  )
}

export const NumberRangeColumnFilter = ({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) => {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div style={{ display: 'flex' }}>
      <CFormInput
        value={filterValue[0] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{ width: '70px', marginRight: '0.5rem' }}
      />
      to
      <CFormInput
        value={filterValue[1] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`Max (${max})`}
        style={{ width: '70px', marginLeft: '0.5rem' }}
      />
    </div>
  )
}

export const fuzzyTextFilterFn = (rows, id, filterValue) => {
  const filteredData = matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
  return filteredData
}
export const DataDisplayConditions = function DataDisplayConditions(headerName) {
  const checkHeader = headerName.toLowerCase()
  const headerDetails = abilityDetails(checkHeader)
  let returns = {
    display_table_header: false,
    abilities: [],
  }
  if (headerName) {
    if (checkHeader === 'controls') {
      returns['display_table_header'] = headerDetails['display_table_header']
      returns.abilities = headerDetails['abilities']
    }
  }

  return returns
}

const handleEditClick = (controlId) => {
  console.log('Edit clicked for control:', controlId)
}

const handleDeleteClick = (controlId) => {
  console.log('Delete clicked for control:', controlId)
}

export const existingColumns = [
  {
    Header: 'Controls',
    accessor: 'controls',
    columnSize: 2,
    Filter: () => null,
    Cell: ({ value, row }) => {
      const abilityLoad = abilityDetails('controls')
      const showEdit = abilityLoad?.abilities?.includes('edit')
      const showDelete = abilityLoad?.abilities?.includes('delete')
      return (
        <div className="row">
          <div className="col-xl-12 justify-content-center">
            {showEdit && (
              <span>
                <button
                  className="btn btn-primary controlBtn"
                  onClick={() => handleEditClick(value)}
                  data-id={value}
                >
                  <FaEdit />
                </button>
              </span>
            )}
            {showDelete && (
              <span>
                <button
                  className="btn btn-danger controlBtn"
                  onClick={() => handleDeleteClick(value)}
                  data-id={value}
                >
                  <FaTrashAlt style={{ color: 'white' }} />
                </button>
              </span>
            )}
          </div>
        </div>
      )
    },
  },
]
