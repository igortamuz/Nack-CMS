import React, { Fragment } from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'
import {FiEdit} from 'react-icons/fi'
import {FaTrash} from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Tooltip from '../tooltip'

export const TableContainer = tw.div`w-full mx-auto overflow-auto`
export const TableStyle = styled.table`
  ${tw`table-auto w-full text-left whitespace-nowrap`}

  th {
    ${tw`px-4 py-3 tracking-wider font-bold text-gray-900 text-sm bg-gray-100`}
  }
  & th:first-child{
    ${tw`rounded-tl rounded-bl`}
  }
  & th:last-child{
    ${tw`w-10 tracking-wider font-bold text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br`}
  }

  td {
    ${tw`px-4 py-3`}
  }
  & td:nth-child(1n+1){
    ${tw`border-t-2 border-gray-200`}
  }
  
  tr:last-child td{
    ${tw`border-t-2 border-b-2`
  }
`

const Button = tw.button`p-2 rounded`

interface IUsersTable {
  allUsers: any[];
  heads: string[];
  setDelete: any;
  setModal: any;
}

const Table: React.FC<IUsersTable> = ({allUsers, heads, setDelete, setModal}) => {
  
  const history = useHistory()
  const tableContent = () => {
    if (Object.keys(allUsers).length > 0){
      return allUsers.map((user, index) => (
        <tr key={index}>
          <td>{user.name}</td>
          <td>{user.phone}</td>
          <td>{user.email}</td>
          <td>{user.street}</td>
          <td>{user.cep}</td>
          <td>{user.role === 'admin' ? (<>Admin</>) : (<>Cliente</>)}</td>
          <td>
            <ul className="list-none flex flex-row">
              <li key={'editar'}>
                <Tooltip text='Editar'>
                  <Button onClick={() => history.push(`/dashboard/users/edit/${user._id}`, {
                    title: "Usuários",
                    subHeader: "Editar usuário",
                    mode: "edit"
                    })}>
                      <FiEdit />
                  </Button>
                </Tooltip>
              </li>
              <li key={'remover'}>
                <Tooltip text='Deletar'>
                  <Button onClick={() => {
                    setDelete(user._id)
                    setModal(true)}
                  }>
                    <FaTrash />
                  </Button>
                </Tooltip>
              </li>
            </ul>
          </td>
        </tr>
      ))
    }
    return undefined
  }

  return(
    <Fragment>
      <TableStyle>
        <thead>
          <tr>
            {heads.map((head, index) => <th key={index}>{head}</th>)}
          </tr>
        </thead>
        <tbody>
          {tableContent()}
        </tbody>
      </TableStyle>
      <ToastContainer/>
    </Fragment>
    
  )
}

export default Table