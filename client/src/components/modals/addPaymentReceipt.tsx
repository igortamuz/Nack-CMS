import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api'
import toastOptions from '../../utils/toastOptions';

interface IModal {
  cancelModal: any;
  reload?: any;
  orderId: string;
  credit?: boolean;
}

const AddPaymentReceipt: React.FC<IModal> = ({
  cancelModal,
  reload,
  orderId,
  credit = false
}) => {

  const [receipt, setReceipt] = useState<any>()
  const mimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  const handleChange = (e: any) => {
    if(!mimeTypes.includes(e.target.files[0].type)){
      e.target.value = ''
      toast.error('Tipo de arquivo inválido', toastOptions);
    } else{
      setReceipt(e.target.files[0])
    }
  }

  const handleClick = async () => {
    try {
      if (receipt === '') throw new Error()
      if (orderId === '') throw new Error()

      const formData = new FormData()
      if (credit){
        formData.append("receipt", receipt)
        formData.append("creditId", orderId)
        await api.post('/credit/receipt', formData)
      } else{
        formData.append("receipt", receipt)
        formData.append("orderId", orderId)
        await api.post('/payment/receipt', formData)
      }
      toast.success("Comprovante anexado", toastOptions)
      cancelModal(false)
      setReceipt('')
      reload()
    } catch (error) {
      console.log(error)
      toast.error("Erro ao anexar comprovante!", toastOptions)
    }
  }

  return (
    <Fragment>
      <div>
        <label htmlFor="receipt">Comprovante de pagamento {credit ? "de crédito" : ""}</label>
        <input type="file" name="receipt" className="rounded p-2 bg-gray-200 outline-none focus:ring focus:ring-blue-400" onChange={(e) => handleChange(e)}/>
      </div>
      <div className="flex flex-row pt-8">
        <button className="bg-indigo-500 p-2 rounded-md text-white hover:bg-indigo-800 mr-2"
          onClick={() => handleClick()}>Anexar</button>
        <button className="bg-transparent p-2 rounded-md text-indigo-500 hover:bg-gray-200"
          onClick={() => cancelModal(false)}>Cancelar</button>
      </div>
    </Fragment>
  );
}

export default AddPaymentReceipt;
