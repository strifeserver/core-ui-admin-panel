/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'

import { loading } from 'src/data/app/Loading/Store'
import { listProcessPaginated, listProcess } from 'src/data/components/users/Thunk'

import useDebounce from 'src/app/components/Global/useDebounce'
import useDidMountEffect from 'src/app/components/Global/useDidMountEffect'

const filterByOpt = [
  { value: 'all', text: 'All' },
  { value: 'campaign_code', text: 'Campaign Code' },
  { value: 'subject', text: 'Subject' },
  { value: 'model', text: `Affected Model/s` },
]

const Component = (props) => {
  // useTitle('Campaign')

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
      console.log(store.getState())
      return false;
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

  const title = ['Model', 'Model Code', 'Manufacturer', 'Code', 'Subject', 'Enabled', 'Updated', '']
  const row = state.listPaginated?.data?.map((row) => {
    return [
      row.model,
      row?.model_code,
      row?.manufacturer,
      row.campaign_code,
      row.subject,
      row.is_enabled === 1 ? 'Yes' : 'No',
      row.updated_at,
      <Button to={`/campaign/${row.id}`}>View</Button>,
    ]
  })

  return (
    <div >
      <p>TEST</p>
    </div>
  )
}

export default Component
