import React, {useState, useEffect, Fragment} from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { FaTrash, FaDollarSign } from 'react-icons/fa';

import { toast, ToastContainer } from 'react-toastify';

import api from '../api';

import ContentAreaHeader from '../components/dashboard/contentArea'
import { ContentAreaContainer } from '../components/dashboard/components/contentArea';

import ConfirmationModal from '../components/modals/alert';
import Modal from '../components/modals';
import PaymentModal from '../components/modals/paymentModal';
import AddCreditModal from '../components/modals/addCreditModal';
import AddPaymentReceipt from '../components/modals/addPaymentReceipt';

import Tooltip from '../components/tooltip';
import toastOptions from '../utils/toastOptions'
import Loading from '../components/loading';
import { FiUpload } from 'react-icons/fi';
import { useLocation } from 'react-router';
import PixModal from '../components/modals/pixQrCode';

const Card = styled.div`
  ${tw`col-span-12 mt-4 sm:col-span-6 md:col-span-6 lg:col-span-3 bg-white shadow-md rounded-lg flex flex-col flex-wrap`}
`
const CardHeader = tw.div`flex justify-between items-center text-lg font-bold text-gray-700`
const CardSubHeader = tw.div`flex justify-start text-base font-medium text-gray-400`
const CardImage = styled.div`
  ${tw`w-full h-56 sm:h-64 bg-cover bg-center rounded-t-lg`}
`
const CardBody = tw.div`flex flex-col flex-wrap p-4`
const CardNumbers = tw.div`flex flex-row justify-between flex-wrap text-green-600 py-4`
const CardStatus = tw.div`flex flex-row flex-wrap font-bold`

interface ILocationState {
  credit: boolean;
}

const Dashboard: React.FC = () => {

  const {state} = useLocation<ILocationState>()

  const [allRaffles, setRaffles] = useState<any[]>([])

  const [isLoading, setLoading] = useState<boolean>(false)
  const [cancelId, setCancelId] = useState<string>('')
  const [paymentId, setPaymentId] = useState<string>('')

  const [imageUrl, setImageUrl] = useState<string>('')
  const [balance, setBalance] = useState<number>()
  const [mercadoPagoUrl, setMercadoPagoUrl] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')
  const [paymentReceipt, setPaymentReceipt] = useState<boolean>(false)

  const [alertModal, setAlertModal] = useState<boolean>(false)
  const [paymentModal, setPaymentModal] = useState<boolean>(false)
  const [creditModal, setCreditModal] = useState<boolean>(false)
  const [pixModal, setPixModal] = useState<boolean>(false)
  const [isCredit, setIsCredit] = useState<boolean>(false)
  const [creditTotal, setCreditTotal] = useState<string | undefined >()

  const getAllRaffles = async() => {
    try {
      setLoading(true)
      const res = await api.get('/raffle/client')
      setImageUrl(res.data.url)
      setRaffles(res.data.slots)
    } catch (error) {
      //
    } finally{
      setLoading(false)
    }
  }

  const getBalance = async() => {
    try {
      const res = await api.get('/user/balance')
      setBalance(res.data.balance.toFixed(2))
    } catch (error) {
      //
    }
  }

  const cancelReservation = async() => {
    if (cancelId !== ''){
      try {
        setLoading(true)
        await api.post('/raffle/delete/slot', {id: cancelId})
        toast.success("Números removidos com sucesso", toastOptions)
        getAllRaffles()
      } catch (error) {
        toast.error("Erro ao remover números", toastOptions)
      } finally{
        setAlertModal(false)
        setCancelId('')
        setLoading(false)
      }
    }
  }

  const payReserved = async() => {
    if (paymentId !== ''){
      try {
        setLoading(true)
        const res = await api.get(`/payment/reserved/${paymentId}`)
        setMercadoPagoUrl(res.data.url)
        window.location.href = mercadoPagoUrl
      } catch (error) {
        toast.error("Erro ao processar dados", toastOptions)
      } finally{
        setLoading(false)
      }
    }
  }

  const reloadPage = () => {
    getAllRaffles()
    getBalance()
  }

  useEffect(() =>{
    getAllRaffles()
    getBalance()
    if (state?.credit){
      setCreditModal(true)
    }
  }, [])

  return (
    <Fragment>
      <Modal active={alertModal}>
        <ConfirmationModal 
          cancelModal={setAlertModal}
          action={cancelReservation}/>
      </Modal>
      
      <Modal active={paymentModal}>
        <PaymentModal
          data={{id: paymentId}}
          reload={reloadPage}
          cancelModal={setPaymentModal}
          action={payReserved}
          setPixModal={setPixModal}
        />
      </Modal>
      <Modal active={creditModal}>
        <AddCreditModal 
          cancelModal={setCreditModal}
          setPixModal={setPixModal}
          setIsCredit={setIsCredit}
          setCreditTotal={setCreditTotal}
        />
      </Modal>
      <Modal active={paymentReceipt}>
        <AddPaymentReceipt cancelModal={setPaymentReceipt} reload={getAllRaffles} orderId={orderId}/>
      </Modal>
      <ContentAreaHeader
        title={"Meu painel"}
        subHeader={"Créditos na carteira e sorteios que estou participando"}
        actions={[
          <button className="p-2 bg-green-custom hover:bg-bg-green-custom-darker text-white rounded-md"
           onClick={() => setCreditModal(true)} key={1}>Adicionar créditos</button>
        ]}
      />
      <ContentAreaContainer>
        <div className="mt-8 col-span-12 md:col-span-6 lg:col-span-3 bg-white shadow-md rounded-md border">
          <div className="p-4 relative h-36 flex">
            <div className="absolute shadow-md rounded-md h-20 w-20 -top-8 bg-green-custom flex flex-col items-center justify-center">
              <FaDollarSign className="text-3xl text-white"/>
            </div>
            <span className="absolute right-8 text-xl text-gray-700 opacity-80">Carteira</span>
            <span className="absolute right-12 top-14 text-2xl">$ {balance}</span>
            <div className="absolute bottom-4 text-sm text-gray-700 opacity-80 w-4/5 border-t pt-1">Créditos disponíveis</div>
          </div>
        </div>
      </ContentAreaContainer>
      <ContentAreaContainer className="mt-12">
      {allRaffles?.map((slot: any, index: number) => (
          <Card key={index}>
            <CardImage style={{backgroundImage: `url(${imageUrl}${slot.raffle?.image.filename})`}}/>
            <CardBody>
              <CardHeader>
                {slot.raffle?.title}
                <div className="flex flex-row flex-wrap">
                  {slot.order?.status === 'waiting' ? (
                    <Fragment>
                      <Tooltip text="Cancelar">
                        <FaTrash className="mr-2 cursor-pointer" onClick={() => {
                          setAlertModal(true)
                          setCancelId(slot?._id)}}/>
                      </Tooltip>
                      <Tooltip text="Pagar">
                        <FaDollarSign className="mr-2 cursor-pointer" onClick={() => {
                          setPaymentModal(true)
                          setPaymentId(slot.order?._id)
                        }}/>
                      </Tooltip>
                      <Tooltip left={true} text="Anexar comprovante">
                        <FiUpload className="mr-2 cursor-pointer" onClick={() => {
                          setPaymentReceipt(true)
                          setOrderId(slot.order._id)
                        }}/>
                      </Tooltip>
                    </Fragment>
                  )
                  : ""}
                </div>
              </CardHeader>
              <CardSubHeader>{slot.raffle?.prize}</CardSubHeader>
              <CardNumbers>
                Números:
                {slot.slots?.map((s: any, index: number) => <span key={index}>{s.toString()}</span>)}
              </CardNumbers>
              {slot.order?.status === 'approved' ? (
                <CardStatus className='text-green-500'>Pago</CardStatus>
              ) : slot.order?.status === 'pending' ? 
                <CardStatus className='text-gray-500'>Aguardando confirmação de pagamento</CardStatus>
                : <CardStatus className='text-red-500'>Pagamento pendente</CardStatus>}
              {slot.order?.expireAt !== null ? (
                <div>Válido até: {DateTime.fromISO(slot.order?.deadline).toLocaleString(DateTime.DATETIME_SHORT)}</div>
              ): <div></div>}
            </CardBody>              
          </Card>
        ))}
      </ContentAreaContainer>
      <ToastContainer />
      <Modal active={pixModal}>
        <PixModal 
          cancelModal={setPixModal} 
          data={{orderId: paymentId, paymentTotal: creditTotal}} 
          isCredit={isCredit}
          reload={getAllRaffles}
          setLoading={setLoading}/>
      </Modal>
      <Loading active={isLoading}/>
    </Fragment>
  );
}

export default Dashboard;
