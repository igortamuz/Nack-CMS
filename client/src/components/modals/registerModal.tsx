import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import InputMask from 'react-input-mask'

import { useAuth } from '../../hooks/auth';
import toastOptions from '../../utils/toastOptions';
import api from '../../api';
interface IModal {
  cancelModal: any;
  showLoginModal: any;
}

const Input = tw.input`rounded p-2 bg-gray-200 outline-none focus:ring focus:ring-blue-400`
const MaskedInput = tw(InputMask)`rounded p-2 bg-gray-200 outline-none focus:ring focus:ring-blue-400`

const RegisterModal: React.FC<IModal> = ({
  cancelModal,
  showLoginModal
}) => {

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const {signIn} = useAuth()
  
  const registerAndLoginFunction = async () => {
    try {
      await api.post('/user', {
        name,
        phone,
        email,
        password
      })
      await signIn({email, password})
      toast.success("Conta criada", toastOptions)
      cancelModal(false)
    } catch (error) {
      toast.error("Erro!", toastOptions)
    }
  }

  return (
    <Fragment>
      <h1 className="mb-2 text-xl text-center">Cadastre-se</h1>
      <div className="flex flex-col mb-4">
        <label htmlFor="name">Nome</label>
        <Input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="email">Email</label>
        <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="phone">Telefone</label>
        <MaskedInput type="text" name="phone" mask="(99)99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)}/>
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="password">Senha</label>
        <Input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <div className="flex flex-row pt-8">
        <button className="bg-green-600 p-2 rounded-md text-white hover:bg-green-800 mr-2"
          onClick={() => registerAndLoginFunction()}>Registrar</button>
        <button className="bg-transparent p-2 rounded-md text-indigo-500 hover:bg-gray-200"
          onClick={() => {
            cancelModal(false)
          }}>Cancelar</button>
        <button className="bg-transparent p-2 rounded-md text-indigo-500 hover:bg-gray-200"
          onClick={() => {
            cancelModal(false)
            showLoginModal(true)
          }}>Já possuo uma conta!</button>
      </div>
    </Fragment>
  );
}

export default RegisterModal;
