import React, {useEffect, useState, Fragment} from 'react';
import tw from 'twin.macro';

import api from '../../../api'

import ContentAreaHeader from '../contentArea'
import { ContentArea, ContentAreaContainer } from '../components/contentArea';

import Table, { TableContainer } from '../../tables/creditsTable';
import Loading from '../../loading';

const Card = tw.div`bg-white shadow-md rounded`

const Dashboard: React.FC = () => {
  const heads = ['Comprador', 'Email', 'Valor', 'Comprovante', 'Ações']
  const [allPendingCredits, setPendingCredits] = useState([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [url, setUrl] = useState<string>('')

  const getAllPendingCredits = async () => {
    try {
      setLoading(true)
      const res = await api.get('/credit/pending')
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
        <ContentArea>
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
        </ContentArea>
      </ContentAreaContainer>
      <Loading active={isLoading}/>
    </Fragment>
  );
}

export default Dashboard;
