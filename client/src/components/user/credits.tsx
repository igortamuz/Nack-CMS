import React, {useEffect, useState, Fragment} from 'react';
import tw from 'twin.macro';

import api from '../../api'

import ContentAreaHeader from '../dashboard/contentArea'
import { ContentArea, ContentAreaContainer } from '../dashboard/components/contentArea';

import Table, { TableContainer } from '../tables/userCreditsTable';
import Loading from '../loading';

const Card = tw.div`bg-white shadow-md rounded`
const ContentAreaCustom = tw(ContentArea)`col-span-6`

const Dashboard: React.FC = () => {
  const heads = ['Valor', 'Comprovante', 'Ações']
  const [allPendingCredits, setPendingCredits] = useState([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [url, setUrl] = useState<string>('')

  const getAllPendingCredits = async () => {
    try {
      setLoading(true)
      const res = await api.get('credit/pending/self')
      setPendingCredits(res.data.credits)
      setUrl(res.data.url)
    } catch (error) {
      //
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllPendingCredits()
  }, []);

  return (
    <Fragment>
      <ContentAreaHeader
        title={"Créditos pendentes"}
        subHeader={"Créditos pendentes de validação de pagamento"}
        actions={[]}
      />

      <ContentAreaContainer>
        <ContentAreaCustom>
          <Card>
            <TableContainer>
              <Table 
                allPendingCredits={allPendingCredits}
                heads={heads}
                reload={getAllPendingCredits}
                url={url}
              />
            </TableContainer>
          </Card>
        </ContentAreaCustom>
      </ContentAreaContainer>
      <Loading active={isLoading}/>
    </Fragment>
  );
}

export default Dashboard;
