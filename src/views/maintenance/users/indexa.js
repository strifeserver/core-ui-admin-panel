/* eslint-disable */
import React from 'react'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, usePagination } from 'react-table'
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import abilityDetails from '../../../components/abilities/ability'
import {
  DefaultColumnFilterPropTypes,
  GlobalFilterPropTypes,
  SelectColumnFilterPropTypes,
  NumberRangeColumnFilterPropTypes,
  TablePropTypes,
} from './UserPropTypes'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CFormSelect,
  CButton,
} from '@coreui/react'

DefaultColumnFilter.propTypes = DefaultColumnFilterPropTypes
GlobalFilter.propTypes = GlobalFilterPropTypes
SelectColumnFilter.propTypes = SelectColumnFilterPropTypes
NumberRangeColumnFilter.propTypes = NumberRangeColumnFilterPropTypes
Table.propTypes = TablePropTypes

const abilityList = ['add', 'edit', 'delete', 'export', 'import']

function DataDisplayConditions(headerName) {
  let returns = {
    display_table_header: false,
    abilities: abilityList,
  }
  if (headerName) {
    const checkHeader = headerName.toLowerCase()
    if (checkHeader == 'controls') {
      returns['display_table_header'] = abilityDetails(checkHeader)['display_table_header']
    }
  }
  return returns
}

// Define a default UI for filtering
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Search:{' '}
      <CFormInput
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          width: '90%',
        }}
      />
    </span>
  )
}

// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length

  return (
    <CFormInput
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row) => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <CFormSelect
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </CFormSelect>
  )
}

function NumberRangeColumnFilter({ column: { filterValue = [], preFilteredRows, setFilter, id } }) {
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
    <div
      style={{
        display: 'flex',
      }}
    >
      <CFormInput
        value={filterValue[0] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem',
        }}
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
        style={{
          width: '70px',
          marginLeft: '0.5rem',
        }}
      />
    </div>
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  //Search Filter
  const filterType = 'local'

  //api filtering
  console.log('Filter Search: ' + filterValue + ' on Filter Type: ' + filterType)
  if (filterType == 'local') {
    //local filtering
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
  }
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val
// Our table component
function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    [],
  )

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const {
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    usePagination, // Add usePagination hook
  )

  return (
    <>
      <CCard className="mb-4">
        <CRow>
          <CCol xs lg={12}>
            <CCardHeader>
              <strong>Filters</strong>
            </CCardHeader>
          </CCol>
        </CRow>
        <CCardBody></CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CRow>
          <CCol xs lg={12}>
            <CCardHeader>
              <strong>Datatable</strong>
            </CCardHeader>
          </CCol>

          <CCol xs lg={2} className="offset-10">
            <GlobalFilter
              preGlobalFilteredRows={data}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </CCol>
        </CRow>
        <CCardBody>
          <div className="tableContainer">
            {headerGroups.map((headerGroup, i) => (
              <CRow key={i} {...headerGroup.getHeaderGroupProps()} className="rowStyle">
                {headerGroup.headers.map((column) => {
                  let displayHeader = DataDisplayConditions(column.render('Header'))[
                    'display_table_header'
                  ]

                  return (
                    <CCol
                      key={column.id}
                      hidden={displayHeader}
                      className={`colStyle ${
                        column.render('Header') === 'Controls' ? 'controls' : ''
                      }`}
                      {...column.getHeaderProps()}
                      xs={4}
                      sm={4}
                      md={4}
                      lg={3}
                      xl={column.columnSize ? column.columnSize : 2}
                    >
                      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {column.render('Header')}
                      </p>
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </CCol>
                  )
                })}
              </CRow>
            ))}

            <div {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <CRow key={i} className="rowStyle" {...row.getRowProps()}>
                    {row.cells.map((cell, i) => {
                      let displayHeader = DataDisplayConditions(cell.column.id)[
                        'display_table_header'
                      ]

                      return (
                        <CCol
                          key={i}
                          hidden={displayHeader}
                          className={` ${
                            cell.column.id === 'controls' ? 'controlItemsStyle' : 'colItemsStyle'
                          }`}
                          xs={4}
                          sm={4}
                          md={4}
                          lg={3}
                          xl={cell.column.columnSize ? cell.column.columnSize : 2}
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </CCol>
                      )
                    })}
                  </CRow>
                )
              })}
            </div>
          </div>
        </CCardBody>
      </CCard>

      <CRow>
        <CCol lg={5}>
          {/* <CButton
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="mr-2 btn btn-primary "
          >
            {'<<'}
          </CButton> */}
          <CButton
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="mr-2 btn btn-primary "
          >
            {'<'}
          </CButton>
          <CButton
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="mr-2 btn btn-primary "
          >
            {'>'}
          </CButton>
          {/* <CButton
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="mr-2 btn btn-primary "
          >
            {'>>'}
          </CButton> */}
        </CCol>

        <CCol lg={5}>
          <div className="pageIndex">
            Page {pageIndex + 1} of {pageOptions.length}
          </div>
        </CCol>

        <CCol lg={2}>
          <CFormSelect
            className="pageSelect"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size} rows
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol lg={12}>
          <div>
            Showing the first {pageSize} results of {page.length} rows
          </div>
        </CCol>
      </CRow>
      <div className="pagination"></div>
    </>
  )
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

filterGreaterThan.autoRemove = (val) => typeof val !== 'number'

function dataTable(props) {
  const handleEditClick = (controlId) => {
    console.log('Edit clicked for control:', controlId)
  }

  const handleDeleteClick = (controlId) => {
    console.log('Delete clicked for control:', controlId)
  }

  const [columns, setColumns] = React.useState([])
  const [rowData, setrowData] = React.useState([])
  const filters = {
    NumberRangeColumnFilter: NumberRangeColumnFilter,
    fuzzyTextFilterFn: fuzzyTextFilterFn,
    SelectColumnFilter: SelectColumnFilter,
  }

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost/Sideline/data/userData.json')
        const data = await response.json()
        const columns = data.result.headers.map((header) => {
          const filterName = header.Filter
          if (filterName) {
            const filterFunc = filters[filterName]
            header.Filter = filterFunc
          }
          return header
        })
        setColumns(columns)
        setrowData([...data.result.rows])
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  // Define the existing columns array
  const existingColumns = [
    {
      Header: 'Controls',
      accessor: 'controls',
      columnSize: 2,
      Filter: () => null,
      Cell: ({ value, row }) => {
        const abilityLoad = DataDisplayConditions()
        const showEdit = abilityLoad.abilities.includes('edit')
        const showDelete = abilityLoad.abilities.includes('delete')
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

  // Combine the existing columns array with the fetched columns data
  const combinedColumns = [...existingColumns, ...columns]

  return (
    <div>
      <Table columns={combinedColumns} data={rowData} />
    </div>
  )
}

export default dataTable
