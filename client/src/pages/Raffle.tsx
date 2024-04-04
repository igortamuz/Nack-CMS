import React, {useState, useEffect, Fragment, useMemo} from 'react';
import { useParams } from "react-router-dom";
import tw from 'twin.macro';
import styled from 'styled-components';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Wrapper } from '../components/wrapper';
import { Ticket, TicketArea } from '../components/raffle';
import { ContainerFluid } from '../components/container';
import { useAuth } from '../hooks/auth';

import api from '../api';
import Header from '../components/header';
import Footer from '../components/footer';
import Modal from '../components/modals';
import PaymentMethodModal from '../components/modals/selectPaymentMethod'
import Loading from '../components/loading';
import toastOptions from '../utils/toastOptions';
import MyNumbersModal from '../components/modals/myNumbersModal';
import LoginModal from '../components/modals/loginModal'
import { FaCalendarCheck, FaMinusSquare, FaPlusSquare, FaTwitterSquare, FaWhatsapp } from 'react-icons/fa';
import Slider from 'react-slick';
import Tooltip from '../components/tooltip';
import RegisterModal from '../components/modals/registerModal';
import PixModal from '../components/modals/pixQrCode';

import whatsapp from '../assets/images/whatsapp.svg'
import facebook from '../assets/images/facebook.svg'
import telegram from '../assets/images/telegram.svg'
import { DateTime } from 'luxon';

const Container = tw(ContainerFluid)`w-auto`
const ContentWrapper = styled.div`
  display: flex;
  min-height: calc(100vh);
  margin-bottom: 10rem;
`
const RaffleTitle = tw.h1`font-bold text-2xl text-center mb-4 pt-10`

const DisabledTicket = tw(Ticket)`hocus:cursor-default`
const EnabledTicket = styled(Ticket)`
  ${tw`bg-gray-900 hocus:cursor-pointer hocus:bg-blue-900`}
  
  &.active {
    ${tw`bg-blue-900`}
  }
`

const SelectedArea = styled.div`
  ${tw`absolute bottom-0 fixed w-full grid grid-cols-12 p-4 bg-gray-100 rounded`}
`

const PaymentDiv = styled.div`
  ${tw`col-span-3 flex items-center`}
`

const PaymentInfoDiv = tw(PaymentDiv)``
const PaymentInfoNumbersDiv = tw(PaymentDiv)`col-span-6`

const PayButton = styled.button`
  ${tw`p-4 rounded-md text-white`}
  background-color: #00cd0d;
`
const Items = tw.h5`px-2`
const Content = tw.div`flex flex-row justify-center`

interface IRouteParams {
  id: string
}

const SliderNew = styled(Slider)`
  ${tw`w-96 h-96`}
  .slick-slide {
    ${tw`h-auto`}
  }

  .slick-slide > div {
    ${tw`h-full`}
  }
`

interface IImage {
  readonly src: string;
}

const ImageDiv  = styled.div<IImage>`
  ${tw`bg-center bg-cover h-96`}
  background-image: url(${props => props.src})
`

interface ITickets {
  slots: Array<number>;
  owner: string;
}

const Raffle: React.FC = () => {
  
  const { user } = useAuth()
  const {id}:IRouteParams = useParams()
  // const history = useHistory()
  const [registro, setRegisterModal] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [orderId, setOrderId] = useState<string>('')
  const [tickets, setTickets] = useState<any>([])
  const [userTickets, setUserTickets] = useState<any>([])
  const [ownedTickets, setOwnedTickets] = useState<ITickets[]>([])
  const [reservedTickets, setReservedTickets] = useState<ITickets[]>([])
  const [carouselImages, setCarouselImages] = useState<string[]>([])
  const [ticketPrice, setPrice] = useState<number>(0)
  const [randomNumbers, setRandomNumbers] = useState<number>(0)
  const [raffleTitle, setTitle] = useState<string>("")
  const [prize, setPrize] = useState<string>("")
  const [secondPrize, setSecondPrize] = useState<string>("")
  const [thirdPrize, setThirdPrize] = useState<string>("")
  const [fourthPrize, setFourthPrize] = useState<string>("")
  const [chosenTickets, setChosen] = useState<any>([])
  const [ammountDue, setAmmountDue] = useState<number>(0)
  const [numOfSlots, setNumOfSlots] = useState<number>(0)
  const [filter, setFilter] = useState<string>('all')
  
  const [paymentMethodModal, setPaymentMethodModal] = useState<boolean>(false)
  const [myNumbersModal, setMyNumbersModal] = useState<boolean>(false)
  const [login, setLoginModal] = useState<boolean>(false)
  const [pixModal, setPixModal] = useState<boolean>(false)

  const [endDate, setEndDate] = useState<string>('')
  

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    pauseOnHover: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  const selectPaymentMethod = async() => {
    try {
      setLoading(true)
      if (chosenTickets.length === 0) throw new Error("Nenhum ticket selecionado")

      const response = await api.post('/payment/order/create', {
        slots: chosenTickets,
        owner: user?._id,
        raffleId: id
      })
      setUserTickets(chosenTickets)
      setChosen([])
      setOrderId(response.data.order._id)
      setPaymentMethodModal(true)
      setLoading(false)
    } catch (error) {
      toast.error("Verifique os tickets selecionados", toastOptions)
    }
  }

  // const payForTickets = async() => {
  //   try {
  //     setLoading(true)
  //     if (chosenTickets.length === 0) throw new Error("Nenhum ticket selecionado")

  //     const slotsData = {
  //       slots: chosenTickets,
  //       raffle: id,
  //       owner: user._id
  //     }
  //     const slotRes = await api.post(`/raffle/${id}/select`, slotsData)

  //     const res = await api.get(`/payment/checkout/${id}/${raffleTitle}/${raffleTitle}/${slotRes.data._id}`)
  //     setMercadoPagoUrl(res.data.url)
  //     setPaymentMethodModal(true)
  //     setUserTickets(chosenTickets)
  //     setOrderId(res.data.orderId)
  //     setChosen([])
  //     getAllTickets()
  //   } catch (error) {
  //     //
  //   } finally{
  //     setLoading(false)
  //   }
  // }

  // const pixPayment = async() => {
  //   try {
  //     const response = await api.post('/payment/pix/create', {})
  //     setQrCode(response.data.imagemQrcode)
  //   } catch (error) {
  //     toast.error('Erro ao processar pagamento', toastOptions)
  //   }
  // }

  const getAllTickets = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/raffle/${id}`)

      setTitle(res.data.raffle.title)
      setPrize(res.data.raffle.prize)
      setSecondPrize(res.data.raffle.secondPrize)
      setThirdPrize(res.data.raffle.thirdPrize)
      setFourthPrize(res.data.raffle.fourthPrize)
      setNumOfSlots(res.data.raffle.numberOfSlots)
      setEndDate(res.data.raffle.date)
      const ticketList = [...Array(res.data.raffle.numberOfSlots).keys()].slice(0)

      setTickets(ticketList)
      setOwnedTickets(res.data.ownedTickets)
      setReservedTickets(res.data.reservedTickets)
      const images: string[] = []
      res.data.raffle.imagesRaffle.map((image: any) => {
        images.push(`${res.data.url}/${image.filename}`)
      })
      setCarouselImages(images)
      setPrice(res.data.raffle.ticketPrice)
    } catch (error) {
      //
    } finally {
      setLoading(false)
    }
  }

  const selectRandomTickets = ((quantity: number) => {
    try {
      if (quantity <= 0 || quantity === NaN) throw new Error("Indique a quantidade de números")
      const availableTickets = tickets.filter((ticket:any) => !ownedTickets.includes(ticket) || !reservedTickets.includes(ticket))
      const result = new Array(quantity)
      let len = availableTickets.length
      const taken = new Array(len)
      if (quantity > len) throw new RangeError("Mais elementos que disponíveis")
      while(quantity--){
        const x = Math.floor(Math.random() * len)
        result[quantity] = availableTickets[x in taken ? taken[x] : x]
        taken[x] = --len in taken ? taken[len] : len
      }
      setChosen(result)
    } catch (error) {
      toast.error("Erro!", toastOptions)
    }
  })

  useEffect(() => {
    getAllTickets()
  },[]);

  const handleChooseTicket = ((e:any, ticket: number) => {
    const found = chosenTickets.find((exists: number) => exists === ticket)
    if (!found){
      setChosen((state: any) => [...state, ticket])
      e.currentTarget.classList.add('active')
    } else{
      const unmark = chosenTickets.filter((exists: number) => exists !== ticket)
      e.currentTarget.classList.remove('active')
      setChosen(unmark)
    }
  })

  useEffect(() => {
    setAmmountDue(ticketPrice * chosenTickets.length)
  }, [chosenTickets])

  const ticketsFilter = useMemo(() => {
    let temp: any
    if (filter === 'all'){
      return tickets.map((item: number, index: number) => {
        return ((temp = ownedTickets.findIndex((slot: any) => slot.slots.includes(item))) !== null && temp !== -1) 
        ? (<Tooltip text={ownedTickets[temp]?.owner}>
            <DisabledTicket className="disabled:bg-green-900 w-full"
              key={item + index}
              disabled >
                {item.toString().padStart(4, "0")}
            </DisabledTicket>
          </Tooltip>)
        : (
          ((temp = reservedTickets.findIndex((slot: any) => slot.slots.includes(item))) !== null && temp !== -1) ?
            ( <Tooltip text={reservedTickets[temp]?.owner}>
                <DisabledTicket className="disabled:bg-red-900 w-full"
                  key={item + index}
                  disabled >
                  {item.toString().padStart(4, "0")}
                </DisabledTicket>
              </Tooltip>
            
            )
          : (
            <EnabledTicket
              key={item + index}
              onClick={(e) => {
                handleChooseTicket(e, item)
              }}>
                {item.toString().padStart(4, "0")}
            </EnabledTicket>
          )
        )
      })
    } else if (filter === 'available'){
      return tickets.map((item: number, index: number) => {
        if (!ownedTickets.find((slot: any) => slot.slots.includes(item))
         && (!reservedTickets.find((slot: any) => slot.slots.includes(item)))) {
          return <EnabledTicket
            key={item + index}
            onClick={(e) => {
              handleChooseTicket(e, item)
            }}>
              {item.toString().padStart(4, "0")}
          </EnabledTicket>
        }
      })
    } else if (filter === 'paid'){
      return tickets.map((item: number, index: number) => {
        return ((temp = ownedTickets.findIndex((slot: any) => slot.slots.includes(item))) !== null && temp !== -1) &&
          (
            <Tooltip text={ownedTickets[temp]?.owner}>
              <DisabledTicket className="disabled:bg-green-900 w-full"
                key={item + index}
                disabled >
                {item.toString().padStart(4, "0")}
              </DisabledTicket>
            </Tooltip>
          )
      })
    } else {
      return tickets.map((item: number, index: number) => {
        return ((temp = reservedTickets.findIndex((slot: any) => slot.slots.includes(item))) !== null && temp !== -1) &&
        (
          <Tooltip text={reservedTickets[temp]?.owner}>
            <DisabledTicket className="disabled:bg-red-900 w-full"
              key={item + index}
              disabled >
              {item.toString().padStart(4, "0")}
            </DisabledTicket>
          </Tooltip>
        )
      })
    }
  }, [filter, tickets, ownedTickets, reservedTickets, handleChooseTicket])

  return (
    <Fragment>
      <Header scrollTo=""/>
      <Wrapper className="py-20">
        <ContentWrapper>
          <Container>
            <div className="flex flex-col md:flex-row">
              <SliderNew {...settings}>
                {carouselImages.map((image: string, index: number) =>{
                  if (image){
                    return <ImageDiv key={index} src={image}/>
                  }
                })}
              </SliderNew>
              <div className="flex flex-col pl-8">
                <div className="flex flex-col lg:flex-row mb-6 flex-wrap items-center justify-between">
                  <div className="flex flex-row">
                    <img src={facebook} className="w-8 mr-2 cursor-pointer hover:text-blue-700"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=https://gosorte.com/raffle/${id}`, '_blank')}/>
                    <img src={telegram} className="w-8 mr-2 cursor-pointer hover:text-blue-700"
                      onClick={() => window.open(`https://t.me/share/url?url=https://gosorte.com/raffle/${id}`, '_blank')}/>
                    <FaTwitterSquare className="text-4xl mr-2 text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={() => window.open(`https://www.twitter.com/share?url=https://gosorte.com/raffle/${id}`, '_blank')}/>
                    <img src={whatsapp} className="w-8 mr-2 cursor-pointer hover:text-green-700"
                      onClick={() => window.open(`https://wa.me/?text=Da%20uma%20olhada:%20${raffleTitle}:%20https://gosorte.com/raffle/${id}`, '_blank')}/>
                  </div>
                  <div className="mb-6 md:mb-0 bg-green-600 text-center text-white p-2 rounded-full">R${ticketPrice},00</div>
                </div>
                <div className="mb-6 flex flex-row items-center bg-gray-600 rounded p-2 justify-between">
                  <div className="flex flex-row items-center mr-4">
                    <FaCalendarCheck className="text-xl text-green-custom mr-1"/>
                    <h1 className="text-white">Data do Sorteio</h1>
                  </div>
                  <h2 className="text-white">{DateTime.fromISO(endDate).toLocaleString(DateTime.DATE_SHORT)}</h2>
                </div>
                <div className="mb-6"><h1 className="text-xl font-black">Compra automática</h1></div>
                <div className="flex flex-row">
                  <label className="relative flex flex-row items-center">
                    <button className="cursor-pointer absolute top-1/2 transform -translate-y-1/2 left-3"
                      onClick={() => setRandomNumbers(randomNumbers > 0 ? randomNumbers-1 : 0)}>
                      <FaMinusSquare/>
                    </button>
                    <input type="text"
                      className="border border-gray-300 focus:ring focus:ring-indigo-500 focus:outline-none
                       focus:border-indigo-500 block w-full pl-10 pr-12 py-4 text-base rounded-md text-center"
                      value={randomNumbers}
                    />
                    <button className="cursor-pointer absolute top-1/2 transform -translate-y-1/2 right-3"
                      onClick={() => setRandomNumbers(randomNumbers+1)}>
                      <FaPlusSquare className=""/>
                    </button>
                  </label>
                  <button className="p-2 md:ml-2 mb-4 md:mb-0 bg-indigo-600 text-white rounded-md"
                    onClick={() => selectRandomTickets(randomNumbers)}
                    >Escolher
                    </button>
                </div>
                <div className="flex flex-col mt-6">
                  <h1>1º Prêmio: {prize}</h1>
                  <h1>2º Prêmio: {secondPrize}</h1>
                  <h1>3º Prêmio: {thirdPrize}</h1>
                  <h1>4º Prêmio: {fourthPrize}</h1>
                </div>
              </div>
            </div>
            
            <RaffleTitle>{raffleTitle}</RaffleTitle>
            <div className="flex flex-col justify-center">
              <div className="flex flex-row flex-wrap mb-4">
                <button className="p-2 bg-indigo-900 rounded text-white mr-2" onClick={() => setFilter('all')}>Todos</button>
                <button className="p-2 bg-gray-900 rounded text-white mr-2" onClick={() => setFilter('available')}>Livres</button>
                <button className="p-2 bg-red-900 rounded text-white mr-2" onClick={() => setFilter('reserved')}>Reservados</button>
                <button className="p-2 bg-green-900 rounded text-white mr-2" onClick={() => setFilter('paid')}>Pagos</button>
                <button className="p-2 bg-gray-300 rounded" onClick={() => setMyNumbersModal(true)}>Meus números</button>
              </div>
              <Content>
                <TicketArea>
                  {ticketsFilter}
                </TicketArea>
                {chosenTickets.length > 0 &&(
                  <SelectedArea>
                    <PaymentInfoDiv className="col-span-3 justify-end z-50">
                      Números selecionados:
                    </PaymentInfoDiv>
                    <PaymentInfoNumbersDiv className="flex flex-wrap justify-evenly">
                      {chosenTickets.map((ticket: number, index:number) => <Items key={index}>{ticket}</Items>)}
                    </PaymentInfoNumbersDiv>
                    <PaymentDiv className="justify-center">
                      <PayButton onClick={() => {
                        !user ? setRegisterModal(true) : selectPaymentMethod()
                      }}>Pagar R${ammountDue}</PayButton>
                    </PaymentDiv>
                  </SelectedArea>
                )}
              </Content>
            </div>
          </Container>
        </ContentWrapper>
      </Wrapper>
      <Footer/>
      <Loading active={isLoading}/>
      <Modal active={paymentMethodModal}>
        <PaymentMethodModal 
          cancelModal={setPaymentMethodModal}
          data={{raffleTitle, slots: userTickets, orderId, raffleId: id, userName: user?.name, userId: user?._id}}
          reload={getAllTickets}
          setPixModal={setPixModal}
        />
      </Modal>
      <Modal active={pixModal}>
        <PixModal cancelModal={setPixModal} data={{orderId}} reload={getAllTickets} setLoading={setLoading}/>
      </Modal>
      <Modal active={myNumbersModal}>
        <MyNumbersModal cancelModal={setMyNumbersModal} id={id}/>
      </Modal>
      <Modal active={login}>
        <LoginModal cancelModal={setLoginModal} payAfterLogin={selectPaymentMethod}/>
      </Modal>
      <Modal active={registro}>
        <RegisterModal cancelModal={setRegisterModal} showLoginModal={setLoginModal}/>
      </Modal>
      <ToastContainer/>
    </Fragment>
   
  );
}

export default Raffle;
