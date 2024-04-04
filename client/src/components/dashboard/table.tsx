import React, {useState, useEffect} from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { FiBookOpen, FiEye, FiEyeOff } from 'react-icons/fi'
import { FaStopwatch, FaTrash, FaEdit, FaCheckCircle } from 'react-icons/fa'
import { useHistory } from 'react-router'
import { AiOutlineCloseCircle } from 'react-icons/ai'

import Tooltip from '../tooltip'

import api from '../../api'

import toastOptions from '../../utils/toastOptions'

import IRaffle from '../../interfaces/IRaffles'
// import ISlot from '../../interfaces/ISlot'

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

interface ITableProps {
  allRaffles: Array<IRaffle>;
  heads: Array<string>;
  changeStatus: any;
  removeRaffle: any;
  endId: any;
  modal: any;
}

const Table: React.FC<ITableProps> = ({allRaffles, heads, changeStatus, endId, modal, removeRaffle}) => {
  
  const history = useHistory()
  const [file, setFile] = useState<any>()
  const generateReport = async(id: string) =>{
    try {
      const res = await api.get(`report/raffle/${id}`)
      setFile(res.data)
    } catch (error) {
      toast.error("Erro ao gerar relatório", toastOptions)
    }
  }

  useEffect(() => {
    if (file !== undefined){
      window.location.href = file
    }
  }, [file])

  return(
    <TableStyle>
      <thead>
        <tr>
          {heads.map((head, index) => <th key={index}>{head}</th>)}
        </tr>
      </thead>
      <tbody>
        {allRaffles.map((raffle, index) => (
          <tr key={index}>
            <td>{raffle.title}</td>
            <td>{raffle.prize}</td>
            <td>{raffle.secondPrize || "Sem prêmio"}</td>
            <td>{raffle.thirdPrize || "Sem prêmio"}</td>
            <td>{raffle.fourthPrize || "Sem prêmio"}</td>
            <td>{raffle.numberOfSlots}</td>
            <td>{raffle.ticketPrice}</td>
            <td>{raffle.quickRaffle ? <FaCheckCircle/> : <AiOutlineCloseCircle/>}</td>
            <td>{raffle.pagos}</td>
            <td>{raffle.reservados}</td>
            <td>
              <ul className="list-none flex flex-row">
                <li key={'relatorio'}>
                  <Tooltip text="Relatório">
                    <Button onClick={() => generateReport(raffle._id)}><FiBookOpen/></Button>
                  </Tooltip>
                </li>
                <li key={'editar'}>
                  <Tooltip text="Editar">
                    <Button onClick={() => history.push(`/dashboard/edit/${raffle._id}`)}><FaEdit/></Button>
                  </Tooltip>
                </li>
                {raffle.status ? 
                  <li key={'desativar'}>
                    <Tooltip text="Desativar">
                      <Button onClick={() => changeStatus(raffle._id)}><FiEyeOff/></Button>
                    </Tooltip> 
                  </li>
                  :
                  <li key={'ativar'}>
                    <Tooltip text="Ativar">
                      <Button onClick={() => changeStatus(raffle._id)}><FiEye/></Button> 
                    </Tooltip>
                  </li>
                }
                {raffle.raffled === 'unraffled' && (
                  <li key={'finalizar'}>
                    <Tooltip text="Finalizar">
                      <Button onClick={() => {
                        modal(true)
                        endId(raffle._id)
                      }}><FaStopwatch/></Button>
                    </Tooltip>
                  </li>
                )}
                <li key={'deletar'}>
                  <Tooltip text="Deletar">
                    <Button onClick={() => removeRaffle(raffle._id)}><FaTrash/></Button>
                  </Tooltip>
                </li>
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </TableStyle>
  )
}

export default Table