import React, {Fragment, useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import * as yup from 'yup'

import { toast, ToastContainer } from "react-toastify";
import toastOptions from "../utils/toastOptions";
import api from "../api";

import logo from '../assets/images/logo-semfundo.png'

const Container = tw.div`relative min-h-screen bg-blue-900 text-white font-medium flex justify-center`;
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

const ForgotPassword: React.FC = ({

}) => {
  const [email, setEmail] = useState<string>("");
  const [sent, setEmailSent] = useState<boolean>(false)

  const emailSchema = yup.object().shape({
    email: yup.string().email().required()
  })

  const sendMail = async (e: any) => {
    e.preventDefault()
    try{
      const validation = await emailSchema.isValid({email})
      if (validation === false){
        throw new Error("Verifique seu email e tente novamente")
      }
      
      await api.post('/recovery/password/generate', {email})
      setEmailSent(true)
    } catch(e){
      toast.error(e.message, toastOptions)
    }
  }

  return (
  // <AnimationRevealPage>
    <Container>
      <Content>
        <MainContainer>
          <LogoLink href={"/"}>
            <LogoImage src={logo} />
          </LogoLink>
          <MainContent>
            <Heading>{"Esqueceu a senha?"}</Heading>
            <FormContainer onSubmit={(e) => sendMail(e)}>
              <DividerTextContainer />
              {sent ? 
                <h1 className="my-6 text-base text-gray-600 text-center">
                  E-mail enviado, verifique sua caixa de entrada e possivelmente de spam.
                </h1>
              :
                <Fragment>
                  <h1 className="my-6 text-base text-gray-600 text-center">Insira seu e-mail e, se existir, receberá uma mensagem para recuperar sua conta</h1>
                  <Form>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(value) => setEmail(value.target.value)}
                    />
                    <SubmitButton type="submit">
                      {/* <SubmitButtonIcon className="icon" /> */}
                      <span className="text">{"Enviar"}</span>
                    </SubmitButton>
                  </Form>
                </Fragment>
              }
            </FormContainer>
          </MainContent>
        </MainContainer>
      </Content>
      <ToastContainer />
    </Container>
  // </AnimationRevealPage>
)};

export default ForgotPassword