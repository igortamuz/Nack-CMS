import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/auth';
import toastOptions from '../../utils/toastOptions';

interface IModal {
  cancelModal: any;
  payAfterLogin: any;
}

const LoginModal: React.FC<IModal> = ({
  cancelModal,
  payAfterLogin
}) => {

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const {signIn} = useAuth()
  
  const loginFunction = async () => {
    try {
      await signIn({email, password})
      cancelModal(false)
      toast.success("Bem-vindo", toastOptions)
    } catch (error) {
      toast.error("Erro!", toastOptions)
    }
  }

  return (
    <Fragment>
      <h1 className="mb-2 text-xl text-center">Faça login</h1>
      <div className="flex flex-col mb-4">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" className="rounded p-2 bg-gray-200 outline-none focus:ring focus:ring-blue-400"
         value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="password">Senha</label>
        <input type="password" name="password" className="rounded p-2 bg-gray-200 outline-none focus:ring focus:ring-blue-400"
         value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <div className="flex flex-row pt-8">
        <button className="bg-green-600 p-2 rounded-md text-white hover:bg-green-800 mr-2"
          onClick={() => loginFunction()}>Entrar</button>
        <button className="bg-transparent p-2 rounded-md text-indigo-500 hover:bg-gray-200"
          onClick={() => {
            cancelModal(false)
          }}>Cancelar</button>
      </div>
    </Fragment>
  );
}

export default LoginModal;
