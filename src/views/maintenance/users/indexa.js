/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, usePagination } from 'react-table'
import abilityDetails from '../../../components/abilities/ability'
import {
  DefaultColumnFilter,
  SelectColumnFilter,
  NumberRangeColumnFilter,
  fuzzyTextFilterFn,
  existingColumns,
  abilityList,
} from './tableUtils'
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
import { useDispatch, useSelector, useStore } from 'react-redux'

import { loading } from 'src/data/app/Loading/Store'
import { listProcessPaginated, listProcess } from 'src/data/components/users/Thunk'

import useDebounce from 'src/app/components/Global/useDebounce'
import useDidMountEffect from 'src/app/components/Global/useDidMountEffect'

let columns = []
let rowData = []
DefaultColumnFilter.propTypes = DefaultColumnFilterPropTypes
GlobalFilter.propTypes = GlobalFilterPropTypes
SelectColumnFilter.propTypes = SelectColumnFilterPropTypes
NumberRangeColumnFilter.propTypes = NumberRangeColumnFilterPropTypes
Table.propTypes = TablePropTypes

const filterByOpt = [
  { value: 'all', text: 'All' },
  { value: 'campaign_code', text: 'Campaign Code' },
  { value: 'subject', text: 'Subject' },
  { value: 'model', text: `Affected Model/s` },
]

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

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val
// --------------------------------------------------------------------------------------
// Our table component
function Table({ columns, data, setSearch }) {

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
      defaultColumn,
      data: rowData,
      filterTypes: {
        fuzzyText: fuzzyTextFilterFn, // use the updated fuzzyTextFilterFn
      },
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
                  let displayHeader = abilityDetails(column.render('Header'))[
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
                      {console.log(column.render('Filter'))}
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
                      let displayHeader = abilityDetails(cell.column.id)['display_table_header']

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


// --------------------------------------------------------------------------------------------------------
function dataTable(props) {
  const state = useSelector((state) => state.campaign)
  const dispatch = useDispatch()
  const store = useStore()

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  let limit = 10 // Default

  //filtering and search
  const [filterBy, setFilterBy] = useState(filterByOpt[0].value)
  const [search, setSearch] = useState('')
  const debounceQuery = useDebounce(search, 500)
  let filterMode = true

  let filteredObj = {}
  filteredObj[filterBy] = { filter: debounceQuery }
  filteredObj = JSON.stringify(filteredObj)

  useEffect(() => {
    async function init() {
      dispatch(loading(true))
      await dispatch(listProcessPaginated(currentPage, filteredObj, limit))
      const item = store.getState().campaign.listPaginated
      setTotalCount(item.total)
      dispatch(loading(false))
    }

    init()
  }, [dispatch])

  useDidMountEffect(() => {
    const search = async () => {
      let page = 1
      setCurrentPage(page)
      await dispatch(listProcessPaginated(page, filteredObj, limit))
      const item = store.getState().campaign.listPaginated
      setTotalCount(item.total)
    }

    search()
  }, [debounceQuery, filterBy])

  const handlePageChange = async (page) => {
    setCurrentPage(page)
    await dispatch(listProcessPaginated(page, filteredObj, limit))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFilterBy = (e) => {
    setFilterBy(e.target.value)
    setCurrentPage(1)
  }

  if (state.listPaginated.rows) {
    rowData = state.listPaginated?.rows
    columns = state.listPaginated?.headers
  }

  const filters = {
    NumberRangeColumnFilter: NumberRangeColumnFilter,
    fuzzyTextFilterFn: fuzzyTextFilterFn,
    SelectColumnFilter: SelectColumnFilter,
  }
  columns = state.listPaginated?.headers?.map((header) => {
    const filterName = header.Filter
    if (filterName) {
      const filterFunc = filters[filterName]
      const filteredHeader = { ...header, Filter: filterFunc }
      return filteredHeader
    }
    return header
  })

  let combinedColumns = []
  if (columns) {
    combinedColumns = [...existingColumns, ...columns]
  }

  return (
    <div>
      <Table columns={combinedColumns} data={rowData} setSearch={setSearch}/>
    </div>
  )
}

export default dataTable
