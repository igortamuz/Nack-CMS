import React, {useState, Fragment, useEffect} from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import api from '../api';
import ContentAreaHeader from '../components/dashboard/contentArea'
import { ContentArea, ContentAreaContainer } from '../components/dashboard/components/contentArea';
import { useHistory } from 'react-router-dom';

import { Card, CardBody } from '../components/dashboard/components/card';
import toastOptions from '../utils/toastOptions';
import Loading from '../components/loading';
import { DateTime } from 'luxon';
const Button = tw.button`p-2 rounded`

const Form = styled.form`
  ${tw`grid grid-cols-12`}
  input {
    ${tw`bg-gray-200 px-6 py-3 rounded sm:rounded border-2 sm:border border-gray-400 hover:border-blue-500 focus:outline-none focus:ring transition duration-300 w-full`}
  }
`

const Checkbox = styled.input`
  width: 1rem !important;
`

const CreateRaffle: React.FC = () => {

  const history = useHistory()
  const [title, setTitle] = useState<string>('')

  const [prize, setPrize] = useState<string>('')
  const [secondPrize, setSecondPrize] = useState<string>('')
  const [thirdPrize, setThirdPrize] = useState<string>('')
  const [fourthPrize, setFourthPrize] = useState<string>('')

  const [ticketPrice, setPrice] = useState<number>(0)
  const [numberOfSlots, setQuantity] = useState<number>(0)
  const [banner, setBanner] = useState<any>()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isQuick, setQuick] = useState<boolean>(false)
  const [images, setImages] = useState<any>([])
  const [endDate, setEndDate] = useState<string>('')
  const mimeTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const handleChangeBanner = (e: any) => {
    if(!mimeTypes.includes(e.target.files[0].type)){
      e.target.value = ''
      toast.error('Tipo de arquivo inválido', toastOptions);
    } else{
      setBanner(e.target.files[0])
    }
  }

  const handleChangeImages = (e: any) => {
    let temp: any[] = []
    for(let item of e.target.files){
      if (!mimeTypes.includes(item.type)){
        e.target.value = ''
        return toast.error("Tipo de arquivo inválido", toastOptions)
      }
      temp.push(item)
    }
    setImages(temp)
  }

  const handleSubmit = async(e: any)=> {
    e.preventDefault()
    
    if (banner === ''){
      return toast.error('Selecione uma imagem para o Banner', toastOptions);
    }
    if (images.length === 0){
      return toast.error("Selecione imagem para o sorteio", toastOptions)
    }

    const formDataBanner = new FormData()
    formDataBanner.append("image", banner)
    let imageId:any 
    try {
      setLoading(true)
      imageId = await api.post('/upload/image', formDataBanner)
    } catch (error) {
      return toast.error("Erro ao enviar imagem", toastOptions);
    } finally{
      setLoading(false)
    }
    
    const formDataImagesSorteio = new FormData()
    for (const key of Object.keys(images)) {
      formDataImagesSorteio.append('images', images[key])
    }
    
    const imagesId: string[] = []

    try {
      setLoading(true)
      const res = await api.post('/upload/image/raffle', formDataImagesSorteio)
      imagesId.push(res.data)
    } catch (error) {
      return toast.error("Erro ao enviar imagens do sorteio", toastOptions)
    } finally{
      setLoading(false)
    }

    try {
      setLoading(true)
      await api.post('/raffle', {
        title, prize, numberOfSlots, ticketPrice,
        image: imageId.data, imagesRaffle: imagesId, secondPrize, thirdPrize,
        fourthPrize, isQuick, date: endDate
      })
    } catch (error) {
      return toast.error("Erro", toastOptions);
    } finally{
      setLoading(false)
    }
    toast.success('Sorteio criado com sucesso', toastOptions);
  }

  return (
    <Fragment>
      <ContentAreaHeader
        title={"Criar sorteio"}
        subHeader={"Criar novo sorteio"}
        actions={[]}
      />
      <ContentAreaContainer>
        <ContentArea className="col-span-12">
          <Card>
            <CardBody>
              <Form encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
                <div className="col-span-12 py-2 md:col-span-6 md:px-2">
                  <label>Titulo do sorteio</label>
                  <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} placeholder={"Título do sorteio"}/>
                </div>
                <div className="col-span-12 py-2 md:col-span-6 md:px-2">
                  <label>1º Prêmio</label>
                  <input type="text" onChange={(e) => setPrize(e.target.value)} value={prize} placeholder={"1º Prêmio"}/>
                </div>
                <div className="col-span-12 py-2 md:col-span-6 md:p-2">
                  <label>2º Prêmio</label>
                  <input type="text" onChange={(e) => setSecondPrize(e.target.value)} value={secondPrize} placeholder={"2º Prêmio"}/>
                </div>
                <div className="col-span-12 py-2 md:col-span-6 md:p-2">
                  <label>3º Prêmio</label>
                  <input type="text" onChange={(e) => setThirdPrize(e.target.value)} value={thirdPrize} placeholder={"3º Prêmio"}/>
                </div>
                <div className="col-span-12 py-2 md:col-span-6 md:p-2">
                  <label>4º Prêmio</label>
                  <input type="text" onChange={(e) => setFourthPrize(e.target.value)} value={fourthPrize} placeholder={"4º Prêmio"}/>
                </div>
                <div className="col-span-12 py-2 md:col-span-2 md:p-2">
                  <label>Preço do ticket</label>
                  <input type="number" onChange={(e) => setPrice(e.target.valueAsNumber)} value={ticketPrice} placeholder={"Preço do ticket"}/>
                </div>
                <div className="col-span-12 py-2 md:col-span-2 md:p-2">
                  <label>Número de tickets</label>
                  <input type="number" onChange={(e) => setQuantity(e.target.valueAsNumber)} value={numberOfSlots} placeholder={"Número de tickets"}/>
                </div>
                <div className="col-span-12 py-2 md:col-span-2 md:p-2">
                  <label>Data do sorteio</label>
                  <input type="date" onChange={(e) => setEndDate(e.target.value)} value={endDate}/>
                </div>
                <div className="col-span-12 py-2 md:col-span-6 md:p-2">
                  <label htmlFor="file">Imagem do banner</label>
                  <input type="file" name="file" placeholder={"Escolha uma imagem para o banner"} onChange={(e) => handleChangeBanner(e)}/>
                </div>
                <div className="col-span-12 py-2 md:col-span-6 md:p-2">
                  <label htmlFor="images">Imagens do sorteio</label>
                  <input type="file" multiple={true} name="images" placeholder={"Imagens para sorteio"} onChange={(e) => handleChangeImages(e)}/>
                </div>
                <div className="col-span-12 py-2 md:col-span-6 md:p-2 flex flex-row items-center justify-start">
                  <div className="flex flex-row items-center justify-start">
                    <Checkbox type="checkbox" name="quick" id="quick" checked={isQuick} onClick={() => setQuick(!isQuick)} />
                    <label htmlFor="quick" className="whitespace-nowrap pl-2">Prêmio rápido?</label>
                  </div>
                </div>
                <div className="col-span-12 py-2 md:col-span-6 md:p-2 flex flex-row items-start justify-end">
                  <Button className="bg-green-custom p-4 text-gray-800 hover:bg-green-custom-darker" type="submit">Enviar</Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </ContentArea>
      </ContentAreaContainer>
      <ToastContainer/>
      <Loading active={isLoading}/>
    </Fragment>
  );
}

export default CreateRaffle;
