import { Handler, IAuthUser } from "routers/types";
import mercadopago from 'mercadopago'
import Order from "db/models/Order";
import Slot from "db/models/Slot";
import Raffle from "db/models/Raffle";
import Image from "db/models/Image";
import User from "db/models/User";
import Config from "db/models/Config";
import Affiliate from "db/models/Affiliate";
import { DateTime } from "luxon";
import { PreferenceItem } from "mercadopago/models/preferences/create-payload.model";
import axios from 'axios'
import { authenticate, gerenciaNetPixApi } from "utils/gerencianetPix";

export const checkout: Handler = async(req, res) => {
  const {id, title, description, slotId} = req.params
  
  try {
    const slot = await Slot.findById(slotId)
    if (!slot) throw new Error()

    const raffle = await Raffle.findById(id)
    if (!raffle) throw new Error()
    const date = DateTime.now().plus({hours: 72}).toISO()
    const items: PreferenceItem = {
      id,
      title,
      description,
      quantity: parseInt(slot.slots.length),
      currency_id: 'BRL',
      unit_price: raffle.ticketPrice
    }
    const purchaseOrder = {
      items: [
        items
      ],
      payer : {
        email: req.user.email
      },
      external_reference : id,
      back_urls : {
        success : process.env.NODE_ENV === 'production' ? process.env.URL_PRODUCTION+"/payment/success" 
        : process.env.URL_DEVELOPMENT+"/payment/success",
        pending : process.env.NODE_ENV === 'production' ? process.env.URL_PRODUCTION+"/payment/pending" 
        : process.env.URL_DEVELOPMENT+"/payment/pending",
        failure : process.env.NODE_ENV === 'production' ? process.env.URL_PRODUCTION+"/payment/failure" 
        : process.env.URL_DEVELOPMENT+"/payment/failure",
      }
    }

    const preference = await mercadopago.preferences.create(purchaseOrder);

    const order = new Order({
      paymentTotal: slot.slots.length*raffle.ticketPrice,
      deadline: date,
      user: req.user._id,
      preferenceId: preference.body.id,
      slot: slotId
    })
    await order.save()

    slot.order = order._id
    await slot.save()

    if (process.env.NODE_ENV === 'production'){
      return res.send({url: `${preference.body.init_point}`, prefId: preference.body.id, orderId: order._id});    
    } else{
      return res.send({url: `${preference.body.sandbox_init_point}`, prefId: preference.body.id, orderId: order._id});  
    }
  } catch (error) {
    console.log(error)
    return res.send("Erro!");
  }
}

export const payReservedTickets: Handler = async (req, res) => {
  const id = req.params.id
  try {
    const preference = await mercadopago.preferences.findById(id)
    if (process.env.NODE_ENV === 'production'){
      return res.send({url: `${preference.body.init_point}`, prefId: preference.body.id});    
    } else{
      return res.send({url: `${preference.body.sandbox_init_point}`, prefId: preference.body.id});  
    }
  } catch (error) {
    return res.send("Erro ao processar pagamento");
  }
}

export const payWithWallet: Handler = async(req, res) => {
  try {
    const order = await Order.findById(req.body.id)
    if (!order) throw new Error()

    if (req.user.balance < order.paymentTotal) throw new Error("Fundos insuficientes")

    order.status = 'approved'
    order.expireAt = null
    await order.save()

    const slot = await Slot.findById(order.slot)
    slot.status = 'owned'
    slot.expireAt = null
    await slot.save()
    
    const user = await User.findById(req.user._id)
    user.balance = user.balance - order.paymentTotal
    await user.save()

    if (req.user.affiliatedTo){
      addBalance(req.user, order.paymentTotal)
    }
    
    res.status(200).send("Pago")
  } catch (error) {
    console.log(error)
    res.status(400).send("Erro")
  }
}

export const paymentSuccess: Handler = async(req, res) => {
  const {external_reference, payment_id, status, payment_type, preference_id} = req.query
  const url = process.env.NODE_ENV === 'production' ? 'https://gosorte.com/sorteio/' + external_reference 
    : 'http://localhost:3000/sorteio/' + external_reference
  try {
    const order = await Order.findOne({preferenceId: preference_id})
    order.paymentId = payment_id
    order.status = status
    order.paymentType = payment_type
    order.expireAt = null
    await order.save()
    if (status === 'approved'){
      const slot = await Slot.findById(order.slot)
      slot.status = 'owned'
      slot.expireAt = null
      await slot.save()

      if (req.user.affiliatedTo){
        addBalance(req.user, order.paymentTotal)
      }
      
    }
  } catch (error) {
    console.log(error)
  } finally{
    res.redirect(url)
  }
}

const addBalance = async (user: IAuthUser, total: number) => {
  try {
    const indication = await User.findOne({_id: user.affiliatedTo})
    if (!indication) throw new Error("Usuário não encontrado")
    const config = await Config.find()
    const share = total * (config[0].affiliateShare/100)
    indication.balance += share
    await indication.save()

    const affiliate = new Affiliate({affiliate: indication._id, transaction: total, share, indication: user._id})
    await affiliate.save()
  } catch (error) {
    console.log(error)
  }
}

export const paymentPending: Handler = async(req, res) => {
  const {external_reference, payment_id, collection_status, payment_type, preference_id} = req.query
  const url = process.env.NODE_ENV === 'production' ? 'https://gosorte.com/sorteio/' + external_reference 
    : 'http://localhost:3000/sorteio/' + external_reference
  try {
    const order = await Order.findOne({preferenceId: preference_id})
    order.paymentId = payment_id
    order.status = collection_status
    order.paymentType = payment_type
    await order.save()
  } catch (error) {
    console.log(error)
  } finally{
    res.redirect(url)
  }
}

export const paymentFailure: Handler = async(req, res) => {
  const {external_reference, preference_id} = req.query
  try {
    const order = await Order.findOne({preferenceId: preference_id}).populate('slot')
    if (!order) throw new Error("Ordem não encontrada")
    
    const raffle = await Raffle.findById(external_reference)
    raffle.available += order.slot.slots.length
  
    await Slot.findOneAndDelete({_id: order.slot})
    await raffle.save()
    await order.delete()
  } catch (error) {
    console.log(error)
  } finally{
    const url = process.env.NODE_ENV === 'production' ? 'https://gosorte.com/sorteio/' + external_reference 
    : 'http://localhost:3000/sorteio/' + external_reference
    res.redirect(url)
  }
}

export const paymentReceipt: Handler = async(req, res) => {
  try {
    const order = await Order.findById(req.body.orderId)
    if (!order) throw new Error()
    const {filename, path, originalname} = req.file
    const imageUpload = new Image({filename, path, originalName: originalname})
    await imageUpload.save()

    order.receipt = imageUpload._id
    await order.save()
    res.status(200).send("Sucesso")
  } catch (error) {
    console.log(error)
    res.status(400).send("Erro")
  }
}

export const createPixOrder: Handler = async(req, res) => {
  try {
    const order = await Order.findById(req.body.orderId)
    if (!order) throw new Error("Ordem não encontrada")

    const {headers, agent} = await authenticate()
    const orderData = {
      "calendario": {
        "expiracao": 3600
      },
      "devedor": {
        "cpf": req.body.cpf,
        "nome": req.user.name
      },
      "valor": {
        "original": order.paymentTotal.toFixed(2).toString()
      },
      "chave": process.env.GERENCIANET_CHAVE_PIX,
      "solicitacaoPagador": 'Valores referentes a tickets do gosorte'
    }
  
    const createPix = await axios({
      method: 'POST',
      url: gerenciaNetPixApi + '/v2/cob',
      headers,
      httpsAgent: agent,
      data: orderData
    })
  
    const getQrCode = await axios({
      method: 'GET',
      url: gerenciaNetPixApi + '/v2/loc/' + createPix.data.loc.id + '/qrcode',
      headers,
      httpsAgent: agent
    })

    order.txid = createPix.data.txid
    await order.save()

    res.status(201).send(getQrCode.data.imagemQrcode)
  } catch (error) {
    res.status(400).send("Erro")
    console.log(error)
  }
}

export const consultarPix: Handler = async (req, res) => {
  try {
    const txid = req.params.id
    const order = await Order.findOne({txid: txid})
    if (!order) throw new Error()

    const {headers, agent} = await authenticate()
    const location = await axios({
      method: 'GET',
      url: gerenciaNetPixApi + '/v2/cob/' + txid,
      headers,
      httpsAgent: agent
    })
    
    const getQrCode = await axios({
      method: 'GET',
      url: gerenciaNetPixApi + '/v2/loc/' + location.data.loc.id + '/qrcode',
      headers,
      httpsAgent: agent
    })

    res.status(200).send(getQrCode.data.imagemQrcode)

  } catch (error) {
    console.log(error)
    res.status(400).send("Nenhuma cobrança encontrada")
  }
}

export const getPixKeys: Handler = async(req, res) => {
  try {
    const {headers, agent} = await authenticate()
    const response = await axios.get(gerenciaNetPixApi + '/v2/gn/evp', {
      headers,
      httpsAgent: agent
    })
    res.status(200).send(response.data)
  } catch (error) {
    res.status(500).send("Erro")
    console.log(error) 
  }
}