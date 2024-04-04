import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaDollarSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api';
import toastOptions from '../../utils/toastOptions';

interface IModal{
  action: any;
  cancelModal: any;
  data: any;
  redirect?: string;
  reload?: any;
  setPixModal?:any;
}

const PaymentModal: React.FC<IModal> = ({
  action,
  cancelModal,
  data,
  reload,
  setPixModal
}) => {

  const payWithWallet = async() => {
    try {
      await api.post('/payment/wallet', {id: data.id})
      toast.success("Números pagos com sucesso", toastOptions)
      cancelModal(false)
      reload()
    } catch (error) {
      toast.error("Houve um erro, verifique sua carteira", toastOptions)
    }
  }

  return (
    <div className="relative">
      <button className="absolute right-2 top-0 text-xl" onClick={() => cancelModal(false)}><AiOutlineClose/></button>
      <div className="flex justify-start align-center flex-row mt-3">
        <div className="bg-green-100 rounded-full mx-6 flex items-center justify-center h-12 w-12">
          <FaDollarSign className="text-green-600"/>
        </div>
        <h3 className="mt-3 text-xl leading-6 font-black text-gray-800">Pagamento!</h3>
      </div>
      
      <div className="mt-2 px-7 py-3">
        <p className="text-md text-gray-600 text-justify">
          Deseja realizar o pagamento dos números selecionados?
        </p>        
      </div>
      <div className="flex justify-end pt-2">
        <button className="bg-green-600 px-4 py-2 rounded-md text-white hover:bg-green-800 mr-2"
          onClick={() => {
            action()
          }}>Mercado Pago</button>
        <button className="bg-indigo-500 px-4 py-2 rounded-md text-white hover:bg-indigo-800 mr-2"
          onClick={() => payWithWallet()}>Carteira</button>
        <button className="bg-green-custom px-4 py-2 rounded-md text-white hover:bg-green-custom-darker"
          onClick={() => {
            setPixModal(true)
            cancelModal(false)
          }}>PIX</button>
      </div>
    </div>
  );
}

export default PaymentModal;