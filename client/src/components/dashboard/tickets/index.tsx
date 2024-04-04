import React, {useEffect, useState, Fragment} from 'react';
import tw from 'twin.macro';

import api from '../../../api'

import ContentAreaHeader from '../contentArea'
import { ContentArea, ContentAreaContainer } from '../components/contentArea';

import Table, { TableContainer } from '../../tables/ticketsTable';
import Loading from '../../loading';

const Card = tw.div`bg-white shadow-md rounded`

const Dashboard: React.FC = () => {
  const heads = ['Comprador', 'Email', 'Sorteio', 'Comprovante', 'Números', 'Ações']
  const [allPendingTickets, setPendingTickets] = useState([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [url, setUrl] = useState<string>('')
  const getAllPendingTickets = async () => {
    try {
      setLoading(true)
      const res = await api.get('/order/pending')
      setPendingTickets(res.data.tickets)
      setUrl(res.data.url)
    } catch (error) {
      //
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllPendingTickets()
  }, []);

  return (
    <Fragment>
      <ContentAreaHeader
        title={"Tickets pendentes"}
        subHeader={"Tickets pendentes de validação de compra"}
        actions={[]}
      />

      <ContentAreaContainer>
        <ContentArea>
          <Card>
            <TableContainer>
              <Table 
                allPendingTickets={allPendingTickets}
                heads={heads}
                reload={getAllPendingTickets}
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
