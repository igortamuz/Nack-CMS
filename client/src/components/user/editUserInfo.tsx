import axios from 'axios';
import React, {Fragment, useState, useEffect} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import tw from 'twin.macro';
import InputMask from 'react-input-mask'

import api from '../../api';
import toastOptions from '../../utils/toastOptions';
import { ContentArea, ContentAreaContainer } from '../dashboard/components/contentArea';
import ContentAreaHeader from '../dashboard/contentArea';
import Loading from '../loading';
import { FaCamera } from 'react-icons/fa';
import styled from 'styled-components';
import avatarDefault from '../../assets/images/default.jpg'

// const Card = tw.div`bg-white shadow-md rounded`
const ContentAreaUser = tw(ContentArea)`grid grid-cols-12 col-span-12`

const FormContainer = tw.div`w-full flex-1`;

const DividerTextContainer = tw.div`my-4 border-b text-center relative`;

const Form = tw.form`max-w-screen-lg mx-auto grid grid-cols-12`;
const Input = tw.input`w-full px-8 py-4 h-12 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-0 mb-4`;
const MaskedInput = tw(InputMask)`
  w-full px-8 py-4 h-12 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-0 mb-4
`
const SelectInput = tw.select`w-full px-8 py-4 h-12 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-0 mb-4 md:ml-2`
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-sm focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;

const EditUserInfo: React.FC = () => {
  
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [state, setState] = useState<string>('')
  const [phone, setPhone] = useState<string>("");
  const [number, setNumber] = useState<string>('')
  const [complement, setComplement] = useState<string>('')
  const [cep, setCep] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [neighborhood, setNeihborhood] = useState<string>("")
  const [reference, setReference] = useState<string>("")
  
  const [states, setStates] = useState<any[]>()
  const [cities, setCities] = useState<any[]>([])
  const [stateChosen, setStateChosen] = useState<boolean>(false)

  const [avatarPreview, setAvatarPreview] = useState<any>()
  const [avatar, setAvatar] = useState<any>()

  const [isLoading, setLoading] = useState<boolean>(false)
  
  useEffect(() => {
    getUserData()
    getStates()
  }, [])

  useEffect(() => {
    if (state !== ''){
      getCities(state)
    } else{
      setStateChosen(false)
    }
  }, [state])

  const getUserData = async() => {
    try {
      const res = await api.get(`/user/self`)
      setName(res.data.user.name)
      setEmail(res.data.user.email)
      setPhone(res.data.user.phone)
      setCep(res.data.user.cep)
      setState(res.data.user.state)
      setCity(res.data.user.city)
      setComplement(res.data.user.complement)
      setNeihborhood(res.data.user.neighborhood)
      setNumber(res.data.user.number)
      setReference(res.data.user.reference)
      setStreet(res.data.user.street)
      setAvatarPreview(res.data.url + res.data.user.avatar || avatarDefault)
    } catch (error) {
      //
    }
  }

  const getStates = async () => {
    try {
      setLoading(true)
      const estados = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      );
      if (!estados) throw new Error();
      setStates(estados.data);
    } catch (erro) {
      //
    } finally{
      setLoading(false)
    }
  }
  
  const getCities = async (uf: string) => {
    try {
      const cidades = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
      if (!cidades) throw new Error();
      setCities(cidades.data);
    } catch (erro) {
      console.error(erro);
    }
  }

  const editUser = async(e: any) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('avatar', avatar)
      formData.append('name', name)
      formData.append('phone', phone)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('cep', cep)
      formData.append('neighborhood', neighborhood)
      formData.append('street', street)
      formData.append('number', number)
      formData.append('complement', complement)
      formData.append('state', state)
      formData.append('city', city)
      if (name === undefined || email === undefined) throw new Error("Campos inválidos")
      await api.put('/user/update', formData)
      toast.success("Informações atualizadas", toastOptions)
    } catch (error) {
      toast.error("Erro!", toastOptions)
    }
    finally{
      setLoading(false)
    }
  }

  const mimeTypes = ['image/jpeg', 'image/png', 'image/jpg']

  const handleImageChange = (e: any) => {
    if(!mimeTypes.includes(e.target.files[0].type)){
      e.target.value = ''
      toast.error('Tipo de arquivo inválido', toastOptions);
    } else{
      if (e.target.files && e.target.files[0]){
        setAvatarPreview(URL.createObjectURL(e.target.files[0]))
        setAvatar(e.target.files[0])
      }
    }
  }

  const handleChange = (el: any) => {
    el.target.type === 'email' ? setEmail(el.target.value) : setPassword(el.target.value)
  }

  return (
    <Fragment>
      <ContentAreaHeader title="Editar usuário" subHeader={"Meus dados"} actions={[]}/>
      <ContentAreaContainer>
        <ContentAreaUser>
          <div className="col-span-12 flex flex-row items-center justify-center">
            <label className="cursor-pointer relative mb-2 inline-block">
              <img className="mt-6 object-cover rounded-full w-12 h-12" src={avatarPreview}/>
              <input type="file" name="avatar" className="hidden" onChange={(e) => handleImageChange(e)}/>
              <FaCamera className="absolute right-0.5 bottom-0.5"/>
            </label>
          </div>
          <div className="col-span-12">
            <FormContainer onSubmit={(e) => editUser(e)}>
              <DividerTextContainer />
              <h1 className="text-xl mb-3 font-bold opacity-70">Dados de usuário</h1>
              <Form>
                <div className="grid grid-cols-12 col-span-12 gap-2">
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      name="nome"
                      placeholder="Nome completo"
                      value={name}
                      className=""
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="password"
                      placeholder="Senha"
                      value={password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <MaskedInput mask="(99)99999-9999"
                      type="text"
                      placeholder="Telefone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <h1 className="text-xl mb-3 font-bold opacity-70">Endereço</h1>
                <div className="grid grid-cols-12 col-span-12 gap-2">
                  <div className="col-span-12 lg:col-span-3">
                    <MaskedInput mask="99999-999"
                    type="text"
                    placeholder="Cep"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-5">
                    <Input
                      type="text"
                      placeholder="Logradouro"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-2">
                    <Input
                    type="text"
                    placeholder="Número"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-2">
                    <Input
                      type="text"
                      placeholder="Bairro"
                      value={neighborhood}
                      onChange={(e) => setNeihborhood(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="Complemento"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-3">
                    <SelectInput onChange={(e) => {
                      setState(e.target.value)
                      setStateChosen(true)
                      }}>
                      {state ? <option defaultValue={state}>{state}</option>
                        : 
                        <option value="">Selecione uma opção</option>
                      }
                    
                      {states?.map((state: any, index: number) =>
                      <option key={index} value={state.sigla}>
                        {state.sigla}
                      </option>)}
                    </SelectInput>
                  </div>
                  <div className="col-span-12 lg:col-span-3">
                    <SelectInput disabled={!stateChosen} value={city} onChange={(e) => setCity(e.target.value)}>
                      <option value="">Selecione uma opção</option>
                      {cities?.map((city: any, index: number) => 
                        <option key={index} value={city.nome}>{city.nome}</option>
                      )}
                    </SelectInput> 
                  </div>
                  <div className="col-span-12">
                    <Input
                    type="text"
                    placeholder="Referência"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12 text-center">
                    <SubmitButton type="submit">
                      {/* <SubmitButtonIcon className="icon" /> */}
                      <span className="text">{"Atualizar"}</span>
                    </SubmitButton>
                  </div>
                </div>
              </Form>
            </FormContainer>
          </div>
        </ContentAreaUser>
      </ContentAreaContainer>
      <ToastContainer/>
      <Loading active={isLoading}/>
    </Fragment>
  );
}

export default EditUserInfo;
