import React, { Fragment, useEffect, useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import InputMask from 'react-input-mask'
// import cep from "cep-promise";

import { useAuth } from "../hooks/auth";
import { useHistory, useParams } from "react-router-dom";
import api from '../api'
import { toast } from "react-toastify";
import Loading from "../components/loading";
import axios from "axios";
import Header from "../components/header";
import Footer from '../components/footer'
import toastOptions from "../utils/toastOptions";
import avatarDefault from '../assets/images/default.jpg'
import { FaCamera } from "react-icons/fa";

const Container = tw.div`relative min-h-screen bg-black text-white font-medium flex justify-center`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center`;
const MainContainer = tw.div`p-6 sm:p-12`;

const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1`;

const DividerTextContainer = tw.div`my-12 border-b text-center relative`;

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

interface IParams {
  affiliate: string | undefined;
}

const RegisterPage: React.FC = ({

}) => {
  const {signIn} = useAuth()
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [states, setStates] = useState<any[]>()
  const [state, setState] = useState<string>('')
  const [cities, setCities] = useState<any[]>([])
  const [city, setCity] = useState<string>('')
  const [number, setNumber] = useState<string>('')
  const [complement, setComplement] = useState<string>('')
  const [cep, setCep] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [neighborhood, setNeihborhood] = useState<string>("")
  const [reference, setReference] = useState<string>("")
  const [stateChosen, setStateChosen] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [avatarPreview, setAvatarPreview] = useState<any>()
  const [avatar, setAvatar] = useState<any>()
  const history = useHistory()
  const {affiliate}: IParams = useParams()
  
  const handleChange = (el: any) => {
    el.target.type === 'email' ? setEmail(el.target.value) : setPassword(el.target.value)
  }
 
  useEffect(() => {
    getStates()
    setAvatarPreview(avatarDefault)
  }, [])

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

  useEffect(() => {
    if (state !== ''){
      getCities(state)
    } else{
      setStateChosen(false)
    }
  }, [state])

  const getCities = async (uf: string) => {
    try {
      const cidades = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
      if (!cidades) throw new Error();
      setCities(cidades.data);
    } catch (erro) {
      console.error(erro);
    }
  }

  const register = async (e: any) => {
    e.preventDefault()
    try{
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
      formData.append('affiliatedTo', affiliate || '')
      
      await api.post('/user', formData)
      await signIn({email, password})
      history.push('/dashboard/client')
    } catch(e){
      toast.error("Não foi possivel cadastrar", toastOptions)
    } finally{
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

  return (
  // <AnimationRevealPage>
  <Fragment>
    <Header scrollTo={''}/>
    <Container className="pt-10">
      <Content>
        <MainContainer>
          <MainContent>
            <Heading>{"Registrar"}</Heading>
            <label className="cursor-pointer relative mb-2 inline-block">
              <img className="mt-6 object-cover rounded-full w-28 h-28" src={avatarPreview}/>
              <input type="file" name="avatar" className="hidden" onChange={(e) => handleImageChange(e)}/>
              <FaCamera className="absolute right-0.5 bottom-0.5"/>
            </label>
            <FormContainer onSubmit={(e) => register(e)}>
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
                      <option value="">Selecione uma opção</option>
                    {states?.map((state: any, index: number) =>
                      <option key={index} value={state.sigla}>
                        {state.sigla}
                      </option>)}
                    </SelectInput>  
                  </div>
                  <div className="col-span-12 lg:col-span-3">
                    <SelectInput disabled={!stateChosen} onChange={(e) => setCity(e.target.value)}>
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
                      <span className="text">{"Registrar"}</span>
                    </SubmitButton>
                  </div>
                </div>
              </Form>
              <p tw="mt-8 text-sm text-gray-600 text-center">
                Já possui conta?{" "}
                <a href={"/login"} tw="border-b border-gray-500 border-dotted">
                  Entrar
                </a>
              </p>
            </FormContainer>
          </MainContent>
        </MainContainer>
      </Content>
      <Loading active={isLoading}/>
    </Container>
    <Footer/>
  </Fragment>
  // </AnimationRevealPage>
)};

export default RegisterPage