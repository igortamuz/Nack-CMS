import React, { useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api';
import toastOptions from '../../utils/toastOptions';

interface IData {
  slots: Array<number>;
  raffleId: string;
  raffleTitle: string;
  userId: string;
  userName: string;
  orderId: string;
}

interface IModal{
  cancelModal?: any;
  data: IData;
  reload?: any;
  setPixModal?: any;
}

const SelectPaymentMethod: React.FC<IModal> = ({
  cancelModal,
  data,
  reload,
  setPixModal,
}) => {

  const payWithWallet = async() => {
    try {
      await api.post('/payment/wallet', {id: data.orderId})
      toast.success("Números pagos com sucesso", toastOptions)
      cancelModal(false)
      reload()
    } catch (error) {
      toast.error("Houve um erro, verifique sua carteira", toastOptions)
    }
  }

  const createBuyOrder = async(method: string) => {
    try {
      if (method === 'wallet'){
        payWithWallet()
      } else if (method === 'transfer'){
        window.open(`https://api.whatsapp.com/send?phone=+5584999357887&text=Olá, sou 
          ${data.userName} reservei os números ${data.slots.toString()} do sorteio ${data.raffleTitle}
          e gostaria de realizar o pagamento`, "_blank")
        cancelModal(false)
      } else if (method === 'mp'){
        const res = await api.post('/payment/finish', {
          raffleId: data.raffleId,
          orderId: data.orderId
        })
        window.location.href = res.data.url
      } else if(method === 'pix'){
        setPixModal(true)
        cancelModal(false)
      }
    } catch(error) {
      toast.error("Erro ao processar pagamento", toastOptions)
    }
  }

  return (
    <div>
      <div className="flex justify-start align-center flex-row mt-3">
        <div className="bg-green-100 rounded-full mx-6 flex items-center justify-center h-12 w-12">
          <FaDollarSign className="text-green-600"/>
        </div>
        <h3 className="mt-3 text-xl leading-6 font-black text-gray-800">Pagamento!</h3>
      </div>
      
      <div className="mt-2 px-7 py-3">
        <p className="text-md text-gray-600 text-justify">
          Escolha uma das opções abaixo para realizar o pagamento 
        </p>        
      </div>
      <div className="flex flex-row pt-8 justify-center">
        <button className="bg-transparent p-2 rounded-md text-indigo-500 hover:bg-gray-200 mr-2"
          onClick={() => {
            createBuyOrder('transfer')
          }}>Transferência</button>
        <button className="bg-green-600 p-2 rounded-md text-white hover:bg-green-800 mr-2"
          onClick={() => {
            createBuyOrder('mp')
          }}>Mercado Pago</button>
        <button className="bg-indigo-500 p-2 rounded-md text-white hover:bg-indigo-800 mr-2"
          onClick={() => payWithWallet()}>Carteira</button>
        <button className="bg-green-custom w-24 p-2 rounded-md text-white hover:bg-green-custom-darker"
          onClick={() => {
            createBuyOrder('pix')
          }}>PIX</button>
      </div>
    </div>
  );
}

export default SelectPaymentMethod;