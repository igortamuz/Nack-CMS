import React, {Fragment, useEffect, useRef, useState} from 'react';
import tw from 'twin.macro'
import styled from 'styled-components'
import { motion } from 'framer-motion';

import {FaPlusCircle,
  FaMinusCircle,
  FaSearch,
  FaRegCreditCard,
  FaRegArrowAltCircleRight,
  FaChevronRight,
  FaTrophy
} from 'react-icons/fa'

import { GoBookmark } from 'react-icons/go'

// import Hero from '../components/hero/hero'
import Hero from '../components/hero'
import Card from '../components/card'

import Footer from '../components/footer';
import api from '../api';

import ItauLogo from '../assets/images/itau-logo.svg'
import BBLogo from '../assets/images/bb-logo.svg'
import CaixaLogo from '../assets/images/caixa-logo2.svg'
import NubankLogo from '../assets/images/nubank-logo.svg'
import MPLogo from '../assets/images/mp-logo.svg'
import { MdAccountBalance, MdAlarm, MdFilter9Plus } from 'react-icons/md';
import Header from '../components/header';
import Modal from '../components/modals';
import RegisterModal from '../components/modals/registerModal';
import { useAuth } from '../hooks/auth';
import { ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router';
import { DateTime } from 'luxon';
import { AiOutlineBank, AiOutlineThunderbolt } from 'react-icons/ai';

import avatarDefault from '../assets/images/default.jpg'

const Wrapper = styled.div`
  ${tw`md:max-w-screen-xl md:mx-auto flex flex-col md:flex-row flex-wrap items-center justify-center pb-16`}
` 

const CardWrapper = tw.div`md:max-w-screen-xl md:mx-auto flex flex-col md:flex-row flex-wrap items-center justify-between pb-16`

export const SectionHeading = styled.h2`
  ${tw`lg:text-3xl text-xl text-white font-black tracking-wide text-center`}
`

const QuestionToggleIcon = styled.span`
  ${tw`ml-2 bg-indigo-500 text-gray-100 p-1 rounded-full group-hover:bg-indigo-700 group-hover:text-gray-200 transition duration-300`}
  svg {
    ${tw`w-4 h-4`}
  }
`;
const Answer = motion(tw.dd`pointer-events-none text-sm sm:text-base leading-relaxed`);

const CardContainer = styled.div`
  ${tw`h-full flex flex-row sm:border max-w-sm rounded-md relative focus:outline-none 
    mx-0 md:mx-4 mb-4 bg-white lg:w-card-full md:w-card-medium max-w-card-full w-11/12
    transform transition-all ease-in-out hover:scale-105
    cursor-pointer`}
`
const QuickRaffleCardContainer = tw(CardContainer)`w-11/12 md:w-full max-w-full mb-1 mx-0`
const LastWinnersCardContainer = tw(CardContainer)`w-11/12 md:w-full h-auto`

const SequenceNumber = styled.span`
  ${tw`absolute -top-24 -left-10 text-gray-900 opacity-30 font-bold`}
  font-size: 15rem;
`

const List = styled.ul`
  ${tw`list-none flex items-center mr-4`}
  li:nth-child(n+2){
    ${tw`-ml-4`}
  }
`

const Home: React.FC = () => {

  const {user} = useAuth()
  const history = useHistory()

  const [allRaffles, setRaffles] = useState<any[]>([])
  const [quickRaffles, setQuickRaffles] = useState<any[]>([])
  const [lastWinners, setLastWinners] = useState<any[]>([])
  const [imageUrl, setImageUrl] = useState<string>('')
  
  const [registro, setRegisterModal] = useState<boolean>(false)

  const sorteioRef = useRef<HTMLDivElement>(null)
  const ganhadoresRef = useRef<HTMLDivElement>(null)

  const getRaffles = async () => {
    const res = await api.get('/raffle')
    res.data.raffle.map((raffle: any) => {
      raffle.image = res.data.url+raffle.image.filename
      if (raffle.quickRaffle){
        setQuickRaffles([...quickRaffles, raffle])
      }
    })
    setRaffles(res.data.raffle)
  }
  
  const getLastWinners = async () => {
    const res = await api.get('/ganhadores')
    setImageUrl(res.data.url)
    setLastWinners(res.data.raffles)
  }

  useEffect(() => {
    getRaffles()
    getLastWinners()
  }, [])

  const [activeQuestionIndex, setActiveQuestionIndex] = useState<any>(null);

  const togglePaymentType = (paymentIndex: number) => {
    if (activeQuestionIndex === paymentIndex) setActiveQuestionIndex(null);
    else setActiveQuestionIndex(paymentIndex);
  };

  const payments = [
    {
      imageSrc: MPLogo,
      text: (
        <div className="flex flex-col p-4 items-start text-justify">
          <p>Pagamento via mercado pago</p>
          <p>Funciona com autorização automática</p>
        </div>)
    },
    {
      imageSrc: BBLogo,
      text: (
        <div className="flex flex-col p-4 items-start text-justify">
          <p>Titular: Edson Carlos P. de Lima</p>
          <p>PIX: CNPJ - 13.344.762.0001-57</p>
          <p>Agência: 3526-2</p>
          <p>Conta: 120090-5</p>
        </div>
      )
    },
    {
      imageSrc: ItauLogo,
      text: (
        <div className="flex flex-col p-4 items-start text-justify">
          <p>Titular: Edson Carlos P. de Lima</p>
          <p>Agência: 1468</p>
          <p>Conta: 4020-9</p>
        </div>
      )
    },
    {
      imageSrc: CaixaLogo,
      text: (
        <div className="flex flex-col p-4 items-start text-justify">
          <p>Titular: Maria Letícia Santos Lima</p>
          <p>Agência: 3064 | Operação: 13</p>
          <p>Conta Poupança: 52096-8</p>
        </div>
      )
    },
    {
      imageSrc: NubankLogo,
      text: (
        <div className="flex flex-col p-4 items-start text-justify">
          <p>Titular: Edson Carlos P. de Lima</p>
          <p>PIX: Telefone - 84999357887</p>
          <p>Agência: 0001</p>
          <p>Conta: 47422708-4</p>
        </div>
      )
    }
  ]

  const scrollFunction = (section: string) => {
    if (section === 'sorteios' && sorteioRef.current !== null){
      window.scrollTo(0, sorteioRef.current.offsetTop)
    } else if (section === 'ganhadores' && ganhadoresRef.current !== null){
      window.scrollTo(0, ganhadoresRef.current.offsetTop)
    }
  }

  const renderAvatarsList = (data: any) => {
    const uniqueArr = data.filter((values: any) => values.owner._id).slice(0,3)
    return (
      <List >
        {uniqueArr.map((item: any, index:number) =>
          <li key={index}>
           <img className={"h-8 w-8 rounded-full shadow"}
            src={item.owner.avatar === undefined ? avatarDefault : imageUrl+item.owner.avatar} alt="" />
          </li>
        )}
      </List>
    )
  }

  return (
    <Fragment>
      <div className="">
        <Header scrollTo={scrollFunction} />
        <Hero scrollTo={scrollFunction} images={allRaffles.map((item: any) => {
          if (item.quickRaffle === false && item.status){
            return {"src": item.image, "id": item._id}
          }
        })}/>
        <div className="bg-black"ref={sorteioRef}>
          <SectionHeading className="py-12 ml-4 lg:max-w-screen-xl lg:mx-auto flex flex-row items-center">
            <GoBookmark className="text-green-custom mr-2" /> Grandes prêmios
          </SectionHeading>
        </div>
        <div className="bg-black">
          <CardWrapper key={1}>
            {Object.keys(allRaffles).length > 0 ? allRaffles.map((raffle: any, index: number) => {
              if (raffle.status && !raffle.quickRaffle){
                return <CardContainer key={index} onClick={() => history.push(`/premio/${raffle._id}`)}>
                  <div className="h-36 md:w-48 w-32 sm:h-36 bg-cover bg-center rounded-l-md sm:rounded-none"
                  style={{backgroundImage: `url(${raffle.image})`}}></div>
                  <div className="flex flex-col justify-center lg:p-6 px-4 sm:px-10 lg:whitespace-nowrap">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <h5 className="text-base lg:text-xl font-bold text-gray-800">{raffle.title}</h5>
                    </div>
                    <div className="flex flex-row items-center text-sm md:text-base sm:flex-row mt-2 sm:mt-4">
                      {raffle.slots.length > 0  ? 
                        renderAvatarsList(raffle.slots)
                        : ''
                      }
                      <h5 className="text-sm">{raffle.available} disponíveis</h5>
                    </div>
                  </div>
                </CardContainer>
              }
            }) : 
              <div className="flex flex-row justify-center items-center text-center w-full my-2">
                <h1 className="text-white opacity-70 font-bold lg:text-2xl text-xl">Nenhum sorteio disponível</h1>
              </div>
            }
          </CardWrapper>

          {!user && (
          <Wrapper>
            <div className="bg-green-custom-darker md:w-full flex flex-row
              justify-between w-11/12 items-center p-4 rounded-xl text-white
              cursor-pointer transform transition-all ease-in-out hover:scale-105"
              onClick={() => setRegisterModal(true)}
            >
              <FaRegCreditCard className="text-3xl"/>
              <span className="flex flex-col items-center">
                <h1 className="lg:text-2xl text-base font-bold">Tornar-se um afiliado</h1>
                <h2 className="lg:text-base text-sm opacity-80">Ganhe créditos compartilhando</h2>
              </span>
              <FaRegArrowAltCircleRight className="text-3xl"/>
            </div>
          </Wrapper>
        )}
        </div>
        
        <div className="bg-black">
          <SectionHeading className="flex flex-row items-center py-8 ml-4 lg:max-w-screen-xl lg:mx-auto">
            <AiOutlineThunderbolt className="text-green-custom mr-2"/>Prêmios rápidos
          </SectionHeading>
          <CardWrapper className="mt-10">
            {Object.keys(quickRaffles).length > 0 ? allRaffles.map((raffle: any, index: number) => {
              if (raffle.status && raffle.quickRaffle){
                return <QuickRaffleCardContainer key={index}
                onClick={() => history.push(`/premio/${raffle._id}`)}>
                  <div className="h-24 w-24 bg-cover bg-center rounded-l-md sm:rounded-none"
                  style={{backgroundImage: `url(${raffle.image})`}}></div>
                  <div className="flex flex-col justify-center px-10 md:whitespace-nowrap">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <h5 className="text-base md:text-xl font-bold text-gray-800">{raffle.title}</h5>
                    </div>
                    <div className="flex flex-col text-sm md:text-base sm:flex-row justify-start">
                      {raffle.available} disponíveis
                    </div>
                  </div>
                  <div className="absolute text-5xl top-6 right-0 text-yellow-500"><FaChevronRight/></div>
                </QuickRaffleCardContainer>
              }
            }) : 
              <div className="flex flex-row justify-center items-center text-center w-full my-2">
                <h1 className="text-white opacity-70 font-bold lg:text-2xl text-base">Nenhum sorteio disponível</h1>
              </div>
            }
          </CardWrapper>
        </div>
        
        <div className="bg-black opacity-90">
          <div className="w-full text-white">
            <div className="py-10 max-w-screen-xl mx-auto flex flex-col md:flex-row">
              <div className="flex flex-col md:w-1/4 py-8 px-4 mb-4 md:mb-0 relative">
                <div className="flex flex-row items-center justify-center mb-4 lg:text-xl text-base">
                  {<FaSearch/>}
                  <span className="ml-2 font-bold">Escolha o sorteio</span>
                </div>
                <div className="text-gray-400 text-justify text-sm lg:text-base">
                  <p>Escolha o prêmio que gostaria de concorrer, verifique a descrição, regulamento do sorteio e fotos em caso de dúvidas entre em contato com o administrador </p>
                </div>
                <SequenceNumber>1</SequenceNumber>
              </div>
              <div className="flex flex-col md:w-1/4 py-8 px-4 mb-4 md:mb-0 relative">
                <div className="flex flex-row items-center justify-center mb-4 lg:text-xl text-base">
                  {<MdFilter9Plus/>}
                  <span className="ml-2 font-bold">Selecione os números</span>
                </div>
                <div className="text-gray-400 text-justify text-sm lg:text-base">
                  <p>Você pode escolher quantos números desejar! Mais números, mais chances de ganhar </p>
                </div>
                <SequenceNumber>2</SequenceNumber>
              </div>
              <div className="flex flex-col md:w-1/4 py-8 px-4 mb-4 md:mb-0 relative">
                <div className="flex flex-row items-center justify-center mb-4 lg:text-xl text-base">
                  {<MdAccountBalance/>}
                  <span className="ml-2 font-bold">Faça o pagamento</span>
                </div>
                <div className="text-gray-400 text-justify text-sm lg:text-base">
                  <p>Faça o pagamento via transferência bancária ou MercadoPago. Envie o comprovante da transferência ao administrador via whatsapp. </p>
                </div>
                <SequenceNumber>3</SequenceNumber>
              </div>
              <div className="flex flex-col md:w-1/4 py-8 px-4 relative">
                <div className="flex flex-row items-center justify-center mb-4 lg:text-xl text-base">
                  {<MdAlarm/>}
                  <span className="ml-2 font-bold">Aguarde o sorteio</span>
                </div>
                <div className="text-gray-400 text-justify text-sm lg:text-base">
                  <p>Cruze os dedos. Você pode ser o próximo sorteado</p>
                </div>
                <SequenceNumber>4</SequenceNumber>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black">
          <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto">
            <div className="flex flex-col w-full" ref={ganhadoresRef}>
              <div className="flex items-center justify-center py-12">
                <SectionHeading className="flex flex-row items-center">
                  <FaTrophy className="text-green-custom mr-2"/> Últimos ganhadores</SectionHeading>
              </div>
              <Wrapper key={2}>
                {Object.keys(lastWinners).length > 0 ? lastWinners.map((raffle: any, index: number) => (
                  
                  <LastWinnersCardContainer key={index} onClick={() => history.push(`/premio/${raffle._id}`)}>

                    <div className="md:w-48 w-32 h-auto bg-cover bg-center rounded-l-md sm:rounded-none"
                      style={{backgroundImage: `url(${raffle.winner.avatar !== undefined ? 
                        imageUrl + raffle.winner.avatar :
                        avatarDefault})`}}
                    />
                    <div className="flex flex-col justify-center p-6 sm:px-10 sm:py-6 bg-gray-100">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <h5 className="text-base md:text-xl font-bold text-gray-800">{raffle.title}</h5>
                      </div>
                      <div className="flex flex-col text-sm md:text-base sm:flex-row mt-2 sm:mt-4">
                        Vencedor foi {raffle.winner.name} em {DateTime.fromISO(raffle.drawDate).toLocaleString(DateTime.DATETIME_SHORT)} <br/>
                        Parabéns!
                      </div>
                    </div>

                  </LastWinnersCardContainer>
                )) :
                <div className="flex flex-row justify-center items-center text-center w-full my-2">
                  <h1 className="text-white opacity-70 font-bold lg:text-2xl text-base">Nenhum vencedor ainda</h1>
                </div>
                }
              </Wrapper>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-center py-12">
              <SectionHeading className="flex flex-row items-center">
                <AiOutlineBank className="text-green-custom mr-2" />
                Contas bancárias
              </SectionHeading>
              </div>
              <Wrapper key={3}>
                <div className="flex flex-col flex-wrap justify-center items-center text-center md:w-full w-11/12 my-2">
                  {payments.map((payment: any, index:number) => 
                    <div className="cursor-pointer w-full mt-8 select-none border lg:border-0 px-8 py-4 lg:p-0 rounded-lg lg:rounded-none"
                      key={index}
                      onClick={() => {
                        togglePaymentType(index);
                      }}
                      // className="group"
                    >
                      <div className="flex justify-between items-center">
                        <img className="w-24 pl-4 rounded-md border-gray-300" src={payment.imageSrc} alt="" />
                        <QuestionToggleIcon>
                          {activeQuestionIndex === index ? <FaMinusCircle /> : <FaPlusCircle />}
                        </QuestionToggleIcon>
                      </div>
                      <Answer className="bg-gray-100 rounded-md shadow"
                        variants={{
                          open: { opacity: 1, height: "auto", marginTop: "16px" },
                          collapsed: { opacity: 0, height: 0, marginTop: "0px" }
                        }}
                        initial="collapsed"
                        animate={activeQuestionIndex === index ? "open" : "collapsed"}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        {payment.text}
                      </Answer>
                    </div>
                  )}
                </div>
              </Wrapper>
            </div>
          </div>
        </div>
        <Modal active={registro}>
          <RegisterModal cancelModal={setRegisterModal} showLoginModal={""}/>
        </Modal>
        <ToastContainer/>
      </div>
      <Footer/>
    </Fragment>
  );
}

export default Home;
