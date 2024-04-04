import React, { useEffect, useState } from 'react';
import api from '../../api';

interface IData{
  orderId: string;
  paymentTotal?: string;
}

interface IModal{
  cancelModal: any;
  reload: any;
  data: IData;
  isCredit?: boolean;
  setLoading?: any;
}

const PixModal: React.FC<IModal> = ({
  cancelModal,
  data,
  reload,
  isCredit = false,
  setLoading,
}) => {

  const [cpf, setCpf] = useState<string>('')
  const [cpfIsValid, setValidCpf] = useState<boolean>(false)
  const [imagemQrCode, setQRCode] = useState<string>('')

  const getQrCode = async() => {
    setLoading(true)
    if (!isCredit){
      const response = await api.post('/payment/pix/create', {orderId: data.orderId, cpf})
      setQRCode(response.data)
    }
    else{
      const res = await api.post('/credit/pay/pix', {cpf, paymentTotal: data?.paymentTotal})
      setQRCode(res.data)
    }
    setLoading(false)
  }

  const validateCpf = (value: string) => {
    let soma = 0;
    let resto = 0;
    if (value === "00000000000") return false;

    for (let i=1; i<=9; i++) soma = soma + parseInt(value.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(value.substring(9, 10)) ) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(value.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto !== parseInt(value.substring(10, 11) ) ) return false;
    setValidCpf(true);
    return true
  }

  useEffect(() => {
    if (cpf){
      if (validateCpf(cpf)){
        getQrCode()
      }
    }
  }, [cpf])

  return (
    <div>
      <div className="flex justify-center align-center flex-row mt-3">
        {!cpfIsValid ? 
          <div className="flex flex-col justify-center">
            <label className="mb-2">Insira seu CPF para continuar</label>
            <input maxLength={11} className="bg-gray-100 p-4 outline-none rounded focus:ring-2 focus:ring-blue-400" placeholder="CPF SEM PONTOS"   
              value={cpf}
              onChange={(e) => {
                setCpf(e.target.value)
              }}/> 
          </div>
        : <img src={imagemQrCode} />}
      </div>
      
      <div className="flex justify-end pt-2">
        <button className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2"
          onClick={() => {
            cancelModal(false)
            reload()
          }}>Fechar</button>
      </div>
    </div>
  );
}

export default PixModal;