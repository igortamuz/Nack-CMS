import React, { useEffect } from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api';
import toastOptions from '../../utils/toastOptions';

interface IData{
  creditId: string
}

interface IModal{
  cancelModal: any;
  data: IData;
  redirect?: string;
  reload?: any;
}

const PaymentModal: React.FC<IModal> = ({
  cancelModal,
  data,
  reload
}) => {
  useEffect(() => {
    console.log({data})
  }, [])
  // const payWithWallet = async() => {
  //   try {
  //     await api.post('/payment/credit/wallet', {id: data.creditId})
  //     toast.success("Números pagos com sucesso", toastOptions)
  //     cancelModal(false)
  //     reload()
  //   } catch (error) {
  //     toast.error("Houve um erro, verifique sua carteira", toastOptions)
  //   }
  // }

  const payPendingWithMP = async() => {
    try {
      const res = await api.get(`/payment/credit/pay/${data.creditId}`)
      console.log(res.data)
      window.location.href = res.data.url
    } catch (error) {
      console.log(error)
      toast.error("Erro ao selecionar método de pagamento", toastOptions)
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
          Deseja pagar pelos créditos pendentes?
        </p>        
      </div>
      <div className="flex justify-end pt-2">
        {/* <button className="bg-indigo-500 p-2 rounded-md text-white hover:bg-indigo-800"
          onClick={() => payWithWallet()}>Carteira</button> */}
        <button className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2"
          onClick={() => cancelModal(false)}>Cancelar</button>
        <button className="bg-green-600 p-2 rounded-md text-white hover:bg-green-800 mr-2"
          onClick={() => {
            payPendingWithMP()
          }}>Mercado Pago</button>
      </div>
    </div>
  );
}

export default PaymentModal;