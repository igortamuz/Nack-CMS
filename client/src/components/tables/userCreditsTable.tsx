import React, { Fragment, useState } from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'

// import { FaCheck, FaTrash } from 'react-icons/fa'
import api from '../../api'
import { toast, ToastContainer } from 'react-toastify'
import toastOptions from '../../utils/toastOptions'
import { FiDollarSign, FiUpload } from 'react-icons/fi'
import Modal from '../modals'
import AddPaymentReceipt from '../modals/addPaymentReceipt'
import PayPendingCredit from '../modals/creditPaymentModal'
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
  const [payPending, setPayPending] = useState<boolean>(false)
  const [creditId, setCreditId] = useState<string>('')
  
  const tableContent = () => {
    if (allPendingCredits !== undefined && Object.keys(allPendingCredits).length > 0){
      return allPendingCredits.map((credit, index) => (
        <tr key={index}>
          <td>{credit.paymentTotal.toFixed(2)}</td>
          <td>{credit.receipt ? 
            <img src={url+credit.receipt.filename} className="w-32 cursor-pointer"
             onClick={() => window.location.href = url+credit.receipt.filename}/>
             : "" }
          </td>
          <td>
            <ul className="list-none flex flex-row">
              <li>
                <Tooltip text='Comprovante'> 
                  <Button onClick={() => {
                    setPaymentReceipt(true)
                    setCreditId(credit._id)
                  }}><FiUpload/></Button>
                </Tooltip>
              </li>
              {/* <li>
                <Tooltip text='Pagar'> 
                  <Button onClick={() => {
                    setCreditId(credit._id)
                    setPayPending(true)
                  }}>
                    <FiDollarSign/>
                  </Button>
                </Tooltip>
              </li> */}
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
      <Modal active={payPending}>
        <PayPendingCredit cancelModal={setPayPending} reload={reload} 
          data={{creditId: creditId}}
        />
      </Modal>
    </Fragment>
    
  )
}

export default Table