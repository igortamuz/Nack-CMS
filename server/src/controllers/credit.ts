import { Handler } from "routers/types"
import mercadopago from 'mercadopago'
import { PreferenceItem } from "mercadopago/models/preferences/create-payload.model";
import Credit from "db/models/Credit";
import User from "db/models/User";
import Image from "db/models/Image"
import { authenticate, gerenciaNetPixApi } from "utils/gerencianetPix";
import Order from "db/models/Order";
import axios from "axios";

export const checkout: Handler = async(req, res) => {
  try {
    const credit = new Credit({...req.body, user: req.user._id})
    await credit.save()

    const items: PreferenceItem = {
      id: credit._id,
      title: `${credit.paymentTotal} créditos`,
      description: "Adicionando créditos à conta do GoSorte",
      quantity: 1,
      currency_id: 'BRL',
      unit_price: credit.paymentTotal
    }
    
    const purchaseOrder = {
      items: [
        items
      ],
      payer : {
        email: req.user.email
      },
      back_urls : {
        success : "http://localhost:3005/payment/credit/success",
        pending : "http://localhost:3005/payment/credit/pending",
        failure : "http://localhost:3005/payment/credit/failure",
      }
    }

    const preference = await mercadopago.preferences.create(purchaseOrder);

    return res.send({url: `${preference.body.sandbox_init_point}`, prefId: preference.body.id});
  } catch (error) {
    console.log(error)
    return res.send("Erro!");
  }
}

const urlRedirect = process.env.NODE_ENV === 'production' ? 'https://gosorte.com' : 'http://localhost:3000'

export const paymentSuccess: Handler = async(req, res) => {
  const {payment_id, status, payment_type, preference_id} = req.query
  try {
    const credit = await Credit.findOne({preferenceId: preference_id})
    credit.paymentId = payment_id
    credit.status = status
    credit.paymentType = payment_type
    await credit.save()
    if (status === 'approved'){
      const user = await User.findById(credit.user)
      user.balance += credit.paymentTotal
      await user.save()
    }
  } catch (error) {
    console.log(error)
  } finally{
    res.redirect(urlRedirect)
  }
}

export const paymentPending: Handler = async(req, res) => {
  const {external_reference, payment_id, collection_status, payment_type, preference_id} = req.query
  try {
    const credit = await Credit.findOne({preferenceId: preference_id})
    credit.paymentId = payment_id
    credit.status = collection_status
    credit.paymentType = payment_type
    await credit.save()
  } catch (error) {
    console.log(error)
  } finally{
    res.redirect(urlRedirect)
  }
}

export const paymentFailure: Handler = async(req, res) => {
  const {external_reference, preference_id} = req.query
  try {
    const credit = await Credit.findOneAndDelete({preferenceId: preference_id})
    if (!credit) throw new Error("Ordem não encontrada")
  } catch (error) {
    console.log(error)
  } finally{
    res.redirect(urlRedirect)
  }
}

const url = process.env.NODE_ENV === 'production' ? `${process.env.URL_PRODUCTION}/static/`
  : `${process.env.URL_DEVELOPMENT}/static/`

export const getPendingCredits: Handler = async(req, res) => {
  try {
    const credits = await Credit
      .find({status: {$not: {$eq: 'approved'}}})
      .populate('user', ['name', 'email'])
      .populate('receipt', ['filename'])
    res.status(200).send({credits, url})
  } catch (error) {
    res.status(204).send("")
  }
}

export const getUserPendingCredits: Handler = async(req, res) => {
  try {
    const credits = await Credit.find({status: {$not: {$eq: 'approved'}}, user: req.user._id})
      .populate('receipt', ['filename'])
    res.status(200).send({credits, url})
  } catch (error) {
    res.status(204).send()
  }
}

export const authorizeCredit: Handler = async(req, res) =>{
  try {
    const credit = await Credit.findById(req.body.id)
    if (!credit) throw new Error("Ordem de crédito não encontrada")

    credit.status = 'approved'
    await credit.save()

    const user = await User.findById(credit.user)
    user.balance += credit.paymentTotal
    await user.save()

    res.status(200).send("Crédito autorizado")
  } catch (error) {
    res.status(400).send("Erro ao autorizar")
  }
}

export const deleteCredit: Handler = async (req, res) =>{
  try {
    await Credit.findOneAndDelete({_id: req.params.id})
    res.status(200).send("Ordem de crédito removido")
  } catch (error) {
    res.status(400).send("Erro ao remover")
  }
}

export const paymentReceipt: Handler = async(req, res) => {
  try {
    const credit = await Credit.findById(req.body.creditId)
    if (!credit) throw new Error()
    const {filename, path, originalname} = req.file
    const imageUpload = new Image({filename, path, originalName: originalname})
    await imageUpload.save()

    credit.receipt = imageUpload._id
    await credit.save()
    res.status(200).send("Sucesso")
  } catch (error) {
    console.log(error)
    res.status(400).send("Erro")
  }
}

export const payPendingCredits: Handler = async (req, res) => {
  const id = req.params.id
  try {
    const preference = await mercadopago.preferences.findById(id)
    if (process.env.NODE_ENV === 'production'){
      return res.send({url: `${preference.body.init_point}`, prefId: preference.body.id});    
    } else{
      return res.send({url: `${preference.body.sandbox_init_point}`, prefId: preference.body.id});  
    }
  } catch (error) {
    console.log(error)
    return res.send("Erro ao processar pagamento");
  }
}

export const createPixCreditOrder: Handler = async(req, res) => {
  try {
    
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
        "original": req.body.paymentTotal.toFixed(2).toString()
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
    
    const creditOrder = new Credit({user: req.user._id, txid: createPix.data.txid, paymentTotal: req.body.paymentTotal})
    await creditOrder.save()

    res.status(201).send(getQrCode.data.imagemQrcode)
  } catch (error) {
    res.status(400).send("Erro")
    console.log(error)
  }
}