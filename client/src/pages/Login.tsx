import React, { Fragment, useEffect, useState } from "react";
// import AnimationRevealPage from "helpers/AnimationRevealPage.js";
// import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import * as yup from 'yup'

import { useAuth } from "../hooks/auth";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import logo from '../assets/images/logo-semfundo.png'
import toastOptions from "../utils/toastOptions";
import Header from "../components/header";

const Container = tw.div`relative min-h-screen bg-black text-white font-medium flex justify-center`;
const Content = tw.div`max-w-screen-xl w-96 m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center`;
const MainContainer = tw.div`p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const DividerTextContainer = tw.div`my-12 border-b text-center relative`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-sm focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;

const LoginPage: React.FC = ({

}) => {
  const {signIn} = useAuth()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory()

  const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
  })

  const handleChange = (el: any) => {
    el.target.type === 'email' ? setEmail(el.target.value) : setPassword(el.target.value)
  }

  const login = async (e: any) => {
    e.preventDefault()
    try{
      const validation = await loginSchema.isValid({email, password})
      if (validation === false){
        throw new Error("Verifique os campos e tente novamente")
      }
      const authorized = await signIn({email, password})
      if (authorized){
        history.push('/dashboard')
      } else{
        throw new Error("Erro ao tentar login")
      }
    } catch(e){
      toast.error("Erro", toastOptions)
    }
  }

  return (
  // <AnimationRevealPage>
  <Fragment>
    <Header scrollTo={''}/>
    <Container className="pt-10">
      <Content>
        <MainContainer>
          <LogoLink href={"/"}>
            <LogoImage src={logo} />
          </LogoLink>
          <MainContent>
            <Heading>{"Entrar"}</Heading>
            <FormContainer onSubmit={(e) => login(e)}>
              
              <DividerTextContainer />
              <Form>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(value) => setEmail(value.target.value)}
                />
                <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={handleChange}
                />
                <SubmitButton type="submit">
                  {/* <SubmitButtonIcon className="icon" /> */}
                  <span className="text">{"Enviar"}</span>
                </SubmitButton>
              </Form>
              <p tw="mt-6 text-xs text-gray-600 text-center">
                <a href={"/forgot-password"} tw="border-b border-gray-500 border-dotted">
                  Esqueceu a senha ?
                </a>
              </p>
              <p tw="mt-8 text-sm text-gray-600 text-center">
                Não possui conta?{" "}
                <a href={"/cadastrar"} tw="border-b border-gray-500 border-dotted">
                  Cadastrar
                </a>
              </p>
            </FormContainer>
          </MainContent>
        </MainContainer>
      </Content>
      <ToastContainer />
    </Container>
  </Fragment>
  // </AnimationRevealPage>
)};

export default LoginPage