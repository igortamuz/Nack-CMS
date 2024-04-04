import React, {useState, useEffect, Fragment} from 'react';
import tw from 'twin.macro';
import {ToastContainer, toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import api from '../api';

import Table, {TableContainer} from '../components/dashboard/table';
import ContentAreaHeader from '../components/dashboard/contentArea'
import { ContentArea, ContentAreaContainer } from '../components/dashboard/components/contentArea';

import toastOptions from '../utils/toastOptions';
import Modal from '../components/modals';
import EndRaffleModal from '../components/modals/endRaffleModal'
import Loading from '../components/loading';

import IRaffle from '../interfaces/IRaffles';
import ISlot from '../interfaces/ISlot';

const Card = tw.div`bg-white shadow-md rounded`
const Button = tw.button`p-2 rounded`
const CreateRaffle = tw(Button)`p-2 h-10 bg-green-custom text-gray-800 hover:bg-green-custom-darker`

const Dashboard: React.FC = () => {

  const history = useHistory()
  const [allRaffles, setRaffles] = useState<any[]>([])
  const [endModal, setEndModal] = useState<boolean>(false)
  const [endId, setEndId] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(false)

  const heads = ['Titulo', '1º Prêmio',
   '2º Prêmio', '3º Prêmio', '4º Prêmio',
   'Número de tickets', 'Preço do ticket',
   'Prêmio rápido', 'Pagos', 'Reservados', 'Ações']

  const getAllRaffles = async() => {
    try {
      setLoading(true)
      const res = await api.get('/raffle/all')
      setRaffles(res.data)
      res.data.map((raffle: IRaffle) => {
        if (raffle.pagos === undefined) raffle.pagos = 0
        if (raffle.reservados === undefined) raffle.reservados = 0
        raffle.slots?.map((slot: ISlot) => {
          if (slot.status === 'owned') raffle.pagos += slot?.slots?.length ?? 0
          else raffle.reservados += slot?.slots?.length ?? 0
        })
      })
    } catch (error) {
      //
    } finally{
      setLoading(false)
    }
    
  }

  const changeStatus = async(id: string) => {
    try{
      setLoading(true)
      const res = await api.put(`/raffle/status/${id}`)
      const message = !!res.data ? 'Sorteio ativado' : 'Sorteio desativado'
      toast.success(message, toastOptions)
      getAllRaffles()
    }catch(e){
      toast.error("Erro ao atualizar status", toastOptions)
    } finally{
      setLoading(false)
    }
  }

  const endRaffle = async(id: string, sorted: number) => {
    try {
      setLoading(true)
      if (sorted <= 0) throw new Error("Número inválido")
      await api.post('/raffle/finalizar', {id, sorted})
      setEndModal(false)
      setEndId('')
      toast.success("Sorteio finalizado")
    } catch (error) {
      toast.error("Erro ao finalizar sorteio, verificar número")
    } finally{
      setLoading(false)
    }
  }

  const handleRemove = async(id: string) => {
    try {
      setLoading(true)
      await api.delete(`/raffle/remover/${id}`)
      toast.success("Sorteio removido", toastOptions)
    } catch (error) {
      toast.error("Erro ao remover sorteio", toastOptions)
    } finally{
      getAllRaffles()
      setLoading(false)
    }
  }

  useEffect(() =>{
    getAllRaffles()
  }, [])

  return (
    <Fragment>
      <ContentAreaHeader
        title={"Sorteios"}
        subHeader={"Todas os sorteios criados"}
        actions={[
          <CreateRaffle key={1} onClick={() => history.push('/dashboard/create')}>Criar novo</CreateRaffle>
        ]}
      />
      <ContentAreaContainer>
        <ContentArea>
          <Card>
            <TableContainer>
              <Table 
                allRaffles={allRaffles}
                heads={heads}
                changeStatus={changeStatus}
                endId={setEndId}
                modal={setEndModal}
                removeRaffle={handleRemove}
              />
            </TableContainer>
          </Card>
        </ContentArea>
      </ContentAreaContainer>
      <Modal active={endModal}>
        <EndRaffleModal 
          action={endRaffle}
          cancelModal={setEndModal}
          id={endId}
        />
      </Modal>
      <ToastContainer />
      <Loading active={isLoading}/>
    </Fragment>
  );
}

export default Dashboard;
