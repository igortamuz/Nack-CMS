import React, { Fragment, useState } from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'

import { FaCheck, FaTrash } from 'react-icons/fa'
import api from '../../api'
import { toast, ToastContainer } from 'react-toastify'
import toastOptions from '../../utils/toastOptions'
import { FiUpload } from 'react-icons/fi'
import Modal from '../modals'
import AddPaymentReceipt from '../modals/addPaymentReceipt'
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

interface ICreditsTable {
  allPendingCredits: any[];
  heads: string[];
  reload: any;
  url?: string;
}

const Table: React.FC<ICreditsTable> = ({allPendingCredits, heads, reload, url}) => {
  
  const [paymentReceipt, setPaymentReceipt] = useState<boolean>(false)
  const [creditId, setCreditId] = useState<string>('')

  const removeOrder = async(id: string) => {
    try {
      await api.delete(`/credit/delete/${id}`)
      reload()
      toast.success("Ordem de crédito removido", toastOptions)
    } catch (error) {
      toast.error("Erro ao remover", toastOptions)
    } 
  }

  const authorizeOrder = async(id: string) => {
    try {
      await api.post('/credit/authorize', {id})
      reload()
      toast.success("Ordem de crédito autorizada", toastOptions)
    } catch (error) {
      toast.error("Erro ao autorizar", toastOptions)
    }
  }
  
  const tableContent = () => {
    if (allPendingCredits !== undefined && Object.keys(allPendingCredits).length > 0){
      return allPendingCredits.map((credit, index) => (
        <tr key={index}>
          <td>{credit.user.name}</td>
          <td>{credit.user.email}</td>
          <td>{credit.paymentTotal}</td>
          <td>{credit.receipt ? 
            <img src={url+credit.receipt.filename} className="w-32 cursor-pointer"
             onClick={() => window.location.href = url+credit.receipt.filename}/>
             : "" }
          </td>
          <td className="">
            <ul className="list-none flex flex-row">
              <li key={'comprovante'}>
                <Tooltip text="Enviar comprovante" left={true}>
                  <Button onClick={() => {
                    setPaymentReceipt(true)
                    setCreditId(credit._id)
                  }}><FiUpload/></Button>
                </Tooltip>
              </li>
              <li key={'autorizar'}>
                <Tooltip text="Autorizar">
                  <Button onClick={() => authorizeOrder(credit._id)}><FaCheck /></Button>
                </Tooltip>
              </li>
              <li key={'deletar'}>
                <Tooltip text="Deletar">
                  <Button onClick={() => removeOrder(credit._id)}><FaTrash /></Button>
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
      <Modal active={paymentReceipt}>
        <AddPaymentReceipt cancelModal={setPaymentReceipt} reload={reload}
         orderId={creditId} credit={true}/>
      </Modal>
    </Fragment>
    
  )
}

export default Table