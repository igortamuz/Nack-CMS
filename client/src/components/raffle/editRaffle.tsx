import React, {useState, Fragment, useEffect} from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import api from '../../api';
import ContentAreaHeader from '../dashboard/contentArea'
import { ContentArea, ContentAreaContainer } from '../dashboard/components/contentArea';
import { useHistory, useParams } from 'react-router-dom';

import { Card, CardBody } from '../dashboard/components/card';
import toastOptions from '../../utils/toastOptions';
import Loading from '../loading';
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

interface IParams{
  id: string;
}

const EditRaffle: React.FC = () => {

  const {id}: IParams = useParams()
  const [title, setTitle] = useState<string>('')

  const [prize, setPrize] = useState<string>('')
  const [secondPrize, setSecondPrize] = useState<string>('')
  const [thirdPrize, setThirdPrize] = useState<string>('')
  const [fourthPrize, setFourthPrize] = useState<string>('')

  const [ticketPrice, setPrice] = useState<number>(0)
  const [numberOfSlots, setQuantity] = useState<number>(0)

  const [banner, setBanner] = useState<any>()
  const [images, setImages] = useState<any>([])

  const [isLoading, setLoading] = useState<boolean>(false)
  const [isQuick, setQuick] = useState<boolean>(false)
  
  useEffect(() => {
    getRaffleData(id)
  }, [])

  const getRaffleData = async(raffleId: string) => {
    try {
      setLoading(true)
      const res = await api.get(`/raffle/${raffleId}`)
      setTitle(res.data.raffle.title)
      setPrize(res.data.raffle.prize)
      setPrice(res.data.raffle.ticketPrice)
      setQuantity(res.data.raffle.numberOfSlots)
      setQuick(res.data.raffle.quickRaffle)
      setSecondPrize(res.data.raffle.secondPrize)
      setThirdPrize(res.data.raffle.thirdPrize)
      setFourthPrize(res.data.raffle.fourthPrize)
    } catch (error) {
      toast.error("Não foi possivel encontrar o sorteio", toastOptions)
    } finally{
      setLoading(false)
    }
  }

  const mimeTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const handleChangeBanner = (e: any) => {
    if(!mimeTypes.includes(e.target.files[0].type)){
      e.target.value = ''
      toast.error('Tipo de arquivo inválido', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
    
    let imageId:any = undefined
    if (banner !== undefined){
      const formData = new FormData()
      formData.append("image", banner)
      try {
        setLoading(true)
        imageId = await api.post('/upload/image', formData)
      } catch (error) {
        return toast.error("Erro ao editar", toastOptions);
      } finally{
        setLoading(false)
      }
    }

    const imagesId: string[] = []

    if (images.length !== 0){
      const formDataImagesSorteio = new FormData()
      for (const key of Object.keys(images)) {
        formDataImagesSorteio.append('images', images[key])
      }
      try {
        setLoading(true)
        const res = await api.post('/upload/image/raffle', formDataImagesSorteio)
        imagesId.push(res.data)
      } catch (error) {
        return toast.error("Erro ao enviar imagens do sorteio", toastOptions)
      } finally{
        setLoading(false)
      }
    }
    
    try {
      setLoading(true)
      const imageData = imageId
      await api.put(`/raffle/${id}`, {
        title,
        prize,
        numberOfSlots,
        ticketPrice,
        image: imageData ? imageData : undefined,
        imagesRaffle: imagesId || undefined,
        secondPrize,
        thirdPrize,
        fourthPrize,
        isQuick
      })
    } catch (error) {
      return toast.error("Erro ao editar", toastOptions);
    } finally{
      setLoading(false)
    }
    toast.success("Sorteio editado", toastOptions)
  }

  return (
    <Fragment>
      <ContentAreaHeader
        title={"Editar sorteio"}
        subHeader={"Editando"}
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
                <div className="col-span-12 py-2 md:col-span-3 md:p-2">
                  <label>Preço do ticket</label>
                  <input type="number" onChange={(e) => setPrice(e.target.valueAsNumber)} value={ticketPrice} placeholder={"Preço do ticket"}/>
                </div>
                <div className="col-span-12 py-2 md:col-span-3 md:p-2">
                  <label>Número de tickets</label>
                  <input type="number" onChange={(e) => setQuantity(e.target.valueAsNumber)} value={numberOfSlots} placeholder={"Número de tickets"}/>
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
                  <Button className="bg-indigo-700 p-4 text-white hover:bg-indigo-900" type="submit">Enviar</Button>
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

export default EditRaffle;
