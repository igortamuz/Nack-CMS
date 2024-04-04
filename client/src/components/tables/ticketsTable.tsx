import React, { Fragment, useState } from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'

import { FaCheck, FaTrash, FaWhatsapp } from 'react-icons/fa'
import api from '../../api'
import { toast, ToastContainer } from 'react-toastify'
import Modal from '../modals'
import AddPaymentReceipt from '../modals/addPaymentReceipt'
import { FiUpload } from 'react-icons/fi'
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

interface ITicketsTable {
  allPendingTickets: any[];
  heads: string[];
  reload: any;
  url: string;
}

const Table: React.FC<ITicketsTable> = ({allPendingTickets, heads, reload, url}) => {
  
  const [paymentReceipt, setPaymentReceipt] = useState<boolean>(false)
  const [orderId, setOrderId] = useState<string>('')

  const removeOrder = async(id: string) => {
    try {
      await api.delete(`/order/delete/${id}`)
      reload()
      toast.success("Ticket removido", {
        autoClose: 3000,
        position: 'top-right'
      })
    } catch (error) {
      toast.error("Erro ao remover", {
        autoClose: 3000,
        position: 'top-right'
      })
    } 
  }

  const authorizeOrder = async(id: string) => {
    try {
      await api.post('/order/authorize', {id})
      reload()
      toast.success("Ticket autorizado", {
        autoClose: 3000,
        position: 'top-right'
      })
    } catch (error) {
      toast.error("Erro ao autorizar", {
        autoClose: 3000,
        position: 'top-right'
      })
    }
  }
  
  const tableContent = () => {
    if (Object.keys(allPendingTickets).length > 0){
      return allPendingTickets.map((ticket, index) => (
        <tr key={index}>
          <td>{ticket.user.name}</td>
          <td>{ticket.user.email}</td>
          <td>{!!ticket.slot.raffle ? ticket.slot.raffle.title : ""}</td>
          <td>{ticket.receipt ? 
            <img src={url+ticket.receipt.filename} className="w-32 cursor-pointer"
             onClick={() => window.location.href = url+ticket.receipt.filename}/>
             : "" }
          </td>
          <td>{ticket.slot.slots.toString()}</td>
          <td>
            <ul className="list-none flex flex-row">
              <li key={'upload'}>
                <Tooltip text="Enviar comprovante" left={true}>
                  <Button onClick={() => {
                    setPaymentReceipt(true)
                    setOrderId(ticket._id)
                  }}><FiUpload/></Button>
                </Tooltip>
              </li>
              <li key={'autorizar'}>
                <Tooltip text="Autorizar">
                  <Button onClick={() => authorizeOrder(ticket._id)}><FaCheck /></Button>
                </Tooltip>
              </li>
              {!!ticket.user.phone && (
                <li key={'whatsapp'}>
                  <Tooltip text="Whatsapp">
                    <Button onClick={() => window.open(`https://api.whatsapp.com/send?phone=+55${ticket.user.phone}`, "_blank")}>
                      <FaWhatsapp/>
                    </Button>
                  </Tooltip>
                </li>
              )}
              <li key={'remove'}>
                <Tooltip text="Deletar">
                  <Button onClick={() => removeOrder(ticket._id)}><FaTrash /></Button>
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
      <ToastContainer/>
    </TableStyle>
      <Modal active={paymentReceipt}>
        <AddPaymentReceipt cancelModal={setPaymentReceipt} reload={reload} orderId={orderId}/>
      </Modal>
    </Fragment>
  )
}

export default Table