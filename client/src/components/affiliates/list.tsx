import React, {Fragment, useState, useEffect} from 'react';
import { FiCode, FiCopy } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import tw from 'twin.macro';
import api from '../../api';
import { useAuth } from '../../hooks/auth';
import toastOptions from '../../utils/toastOptions';
import { ContentArea, ContentAreaContainer } from '../dashboard/components/contentArea';
import ContentAreaHeader from '../dashboard/contentArea';
import Table from '../tables/affiliatesTable'

const Card = tw.div`bg-white shadow-md rounded`
const ContentArea3 = tw(ContentArea)`col-span-4`
const CopyButton = styled.button`
  ${tw`flex items-center bg-gray-300 px-3 absolute top-1/2 transform -translate-y-1/2 right-0 rounded-tr-md rounded-br-md`}
  height: 95%
`

const Affiliates: React.FC = () => {
  
  const heads = ["Nome", "Email"]
  const {user} = useAuth()
  const [data, setData] = useState<any[]>([])
  const getExtract = async() => {
    const res = await api.get('/client/affiliate/list')
    setData(res.data)
  }
  
  useEffect(() => {
    getExtract()
  }, [])

  return (
    <Fragment>
      <ContentAreaHeader
        title={"Afiliados"}
        subHeader={"Lista de afiliados os quais possuo"}
        actions={[
          <Fragment>
            <button className="bg-indigo-600 p-2 text-white rounded mr-4" key={1} onClick={() => {
              navigator.clipboard.writeText(`https://gosorte.com/cadastrar/${user._id}`)
              toast.success("Link copiado!", toastOptions)}
            }>Copiar link</button>
            <label className="relative flex flex-row items-center">
              <FiCode className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3"/>
              <input type="text"
                className="border border-gray-300 focus:ring focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 block w-full pl-10 pr-12 py-4 sm:text-sm rounded-md" value={user._id}
              />
              <CopyButton
              onClick={() => {
                navigator.clipboard.writeText(`${user._id}`)
                toast.success("Código copiado", toastOptions)
              }}><FiCopy className=""/></CopyButton>
            </label>
          </Fragment>
        ]}
      />
      <ContentAreaContainer>
        <ContentArea3>
          <Card>
            <Table heads={heads} data={data}/>
          </Card>
        </ContentArea3>
      </ContentAreaContainer>
      <ToastContainer/>
    </Fragment>
  );
}

export default Affiliates;
