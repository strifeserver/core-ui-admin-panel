/* eslint-disable */
import DatatTable from './indexa'
import ListView from '../../../components/users/List'

function index() {
  return (
    <div>
    <ListView></ListView>
      <DatatTable dataSource={'users'}></DatatTable>
    </div>
  )
}

export default index
