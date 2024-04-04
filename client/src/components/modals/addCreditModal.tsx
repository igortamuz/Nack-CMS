import React, { Fragment, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import api from '../../api'
import toastOptions from '../../utils/toastOptions';

interface IModal {
  cancelModal: any;
  setPixModal?: any;
  setIsCredit?: any;
  setCreditTotal?: any;
}

const AddCreditModal: React.FC<IModal> = ({
  cancelModal,
  setPixModal,
  setIsCredit,
  setCreditTotal
}) => {

  const [total, setTotal] = useState<number>(0)

  const handleClick = async (mode: string) => {
    try {
      if (total <= 0) throw new Error()
      const res = await api.post('/payment/credit/checkout', {paymentTotal: total})
      if (mode === 'mp'){
        window.location.href = res.data.url
      } else{
        cancelModal(false)
        toast.success("Ordem de créditos criada!", toastOptions)
      }
    } catch (error) {
      console.log(error)
      toast.error("Erro!", toastOptions)
    }
  }

  const payWithPix = () => {
    try {
      if (total <= 0) throw new Error()
      setPixModal(true)
      setCreditTotal(total.toFixed(2).toString())
      setIsCredit(true)
      cancelModal(false)
    } catch (error) {
      toast.error("Erro!", toastOptions)
    }
  }

  return (
    <div className="relative">
      <button className="absolute right-2 top-0 text-xl" onClick={() => cancelModal(false)}><AiOutlineClose/></button>
      <div className="flex flex-col justify-center items-center mt-4">
        <label>Quantos créditos deseja adicionar</label>
        <input type="number" className="rounded p-2 bg-gray-200 outline-none focus:ring focus:ring-blue-400"
          defaultValue={total}
          onChange={(e) => setTotal(e.target.valueAsNumber)}/>
      </div>
      <div className="flex flex-row pt-8">
        <button className="bg-green-600 px-4 py-2 rounded-md text-white hover:bg-green-800 mr-2"
          onClick={() => handleClick("mp")}>Mercado Pago</button>
        <button className="bg-indigo-500 px-4 py-2 rounded-md text-white hover:bg-indigo-800 mr-2"
          onClick={() => handleClick("transfer")}>Transferência</button>
        <button className="bg-green-custom px-4 py-2 rounded-md text-white hover:bg-green-custom-darker"
          onClick={() => {
            payWithPix()
          }}
        >
          PIX</button>
      </div>
    </div>
  );
}

export default AddCreditModal;
