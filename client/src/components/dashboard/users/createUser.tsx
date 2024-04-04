import React, {Fragment, useState} from 'react';
import tw from 'twin.macro';

import api from '../../../api'

import ContentAreaHeader from '../contentArea'
import { ContentArea, ContentAreaContainer } from '../components/contentArea';
import { toast, ToastContainer } from 'react-toastify';
import toastOptions from '../../../utils/toastOptions';
import { useHistory } from 'react-router-dom';

const ContentAreaUser = tw(ContentArea)`col-span-4`
const Card = tw.div`bg-white shadow-md rounded`
const Input = tw.input`p-4 m-2 rounded bg-gray-100 focus:ring-4 focus:ring-blue-300 focus:outline-none`

const CreateUser: React.FC = () => {

  const history = useHistory()
  const [name, setName] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  const addUser = async() => {
    try {
      if (name === undefined || email === undefined || password === undefined) throw new Error("Campos inválidos")
      await api.post('/user/add', {name, email, password, isAdmin})
      toast.success("Usuário adicionado", {
        ...toastOptions,
        onClose: function(){
          history.push('/dashboard/users')
        }
      })
    } catch (error) {
      toast.error("Erro ao adicionar usuário", toastOptions)
    }
  }

  return (
    <Fragment>
      <ContentAreaHeader title="Adicionar usuário" subHeader="Cria um usuário no sistema" actions={[]}/>
      <ContentAreaContainer>
        <ContentAreaUser>
          <Card>
            <div className="flex flex-col p-8">
              <h1 className="p-2 text-xl">Dados do usuário</h1>
              <Input type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)} value={name}/>
              <Input type="email" placeholder="email@email.com" onChange={(e) => setEmail(e.target.value)} value={email}/>
              <Input type="password" name="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password}/>
              <div className="flex justify-between items-center p-2">
                <div>
                  <input className="mr-2" type="checkbox" name="isAdmin" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)}/>
                  <label htmlFor="isAdmin">Admin?</label>
                </div>
                <button className="bg-green-600 p-2 text-white font-bold rounded hover:bg-green-800"
                  onClick={() => addUser()}>Adicionar</button>
              </div>
            </div>
          </Card>
        </ContentAreaUser>
      </ContentAreaContainer>
      <ToastContainer/>
    </Fragment>
  );
}

export default CreateUser;
