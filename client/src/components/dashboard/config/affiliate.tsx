import React, {useEffect, useState, Fragment} from 'react';
import tw from 'twin.macro';

import api from '../../../api'

import ContentAreaHeader from '../contentArea'
import { ContentArea, ContentAreaContainer } from '../components/contentArea';

import { toast, ToastContainer } from 'react-toastify';
import toastOptions from '../../../utils/toastOptions';
import Loading from '../../loading';

const Card = tw.div`bg-white shadow-md rounded`
const ContentAreaCustom = tw(ContentArea)`col-span-3`

const Dashboard: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [exists, setExists] = useState<boolean>(false)
  const [affiliateShare, setShare] = useState<number>(0)
  const [id, setId] = useState<string>('')
  
  useEffect(() => {
    getConfig()
  }, [])

  const getConfig = async() => {
    try {
      setLoading(true)
      const res = await api.get('/dashboard/system/config')
      if (res.data) {
        setExists(true)
        setShare(res.data.affiliateShare)
        setId(res.data._id)
      }
    } catch (error) {
      //
    } finally{
      setLoading(false)
    }
  }

  const handleClick = async() => {
    try {
      setLoading(true)
      if (exists){
        await api.put('/dashboard/system/config', {id, affiliateShare})
      } else{
        await api.post('/dashboard/system/config', {affiliateShare})
      }
      toast.success("Configuração alterada", toastOptions)
    } catch (error) {
      toast.error("Erro", toastOptions)
    } finally{
      setLoading(false)
      getConfig()
    }
  }

  return (
    <Fragment>
      <ContentAreaHeader
        title={"Afiliação"}
        subHeader={"Configuração do programa de afiliação"}
        actions={[]}
      />

      <ContentAreaContainer>
        <ContentAreaCustom>
          <Card>
            <div className="flex flex-col p-8">
              <label htmlFor="share">Porcentagem do afiliado</label>
              <input className="p-2 w-20 rounded-md bg-gray-200" name="share" type="number" onChange={(e) => setShare(parseInt(e.target.value))} value={affiliateShare}/>
              <button className="p-2 mt-4 rounded-md bg-green-custom text-gray-800 hover:bg-green-custom-darker" onClick={() => handleClick()}>Salvar</button>
            </div>
          </Card>
        </ContentAreaCustom>
      </ContentAreaContainer>
      <Loading active={isLoading}/>
      <ToastContainer/>
    </Fragment>
  );
}

export default Dashboard;
