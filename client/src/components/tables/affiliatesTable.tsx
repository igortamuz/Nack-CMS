import React from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'

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

// const Button = tw.button`p-2 rounded`

interface IUsersTable {
  heads: string[];
  data: any[];
}

const Table: React.FC<IUsersTable> = ({heads, data}) => {
  
  const tableContent = () => {
    if (Object.keys(data).length > 0){
      return data.map((user, index) => (
        <tr key={index}>
          <td>{user.name}</td>
          <td>{user.email}</td>
        </tr>
      ))
    }
    return undefined
  }

  return(
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
  )
}

export default Table