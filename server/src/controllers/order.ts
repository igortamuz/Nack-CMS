import mercadopago from 'mercadopago'
import { PreferenceItem } from "mercadopago/models/preferences/create-payload.model";
import { DateTime } from "luxon";
import { Handler, IAuthUser } from "routers/types";
import Order from "db/models/Order";
import Slot, { ISlot } from "db/models/Slot";
import User, { IUser } from "db/models/User";
import Config from "db/models/Config";
import Affiliate from "db/models/Affiliate";
import Raffle from "db/models/Raffle";

export const createOrder: Handler = async(req, res) => {
  try {
    const slots = await Slot.findById(req.body.slot)
    if (!slots) throw new Error()
  
    const order = new Order(req.body)
    
    await order.save()

    res.status(200).send("Ordem de compra criada com sucesso")
  } catch (error) {
    res.status(400).send("Não foi possível criar ordem de compra")
    console.log(error)
  }
}

const url = process.env.NODE_ENV === 'production' ? 'https://gosorte.com/static/'
    : 'http://localhost:3005/static/'

export const getPendingTickets: Handler = async(req, res) => {
  try {
    const tickets = await Order
      .find({status: 'waiting'})
      .populate('user', ['name', 'email', 'phone'])
      .populate({
        path: 'slot',
        select: ['slots', 'raffle'],
        populate: {path: 'raffle', select: ['title']}
      })
      .populate('receipt', ['filename'])
    res.status(200).send({tickets, url})
  } catch (error) {
    console.log(error)
    res.status(204).send("")
  }
}

export const authorizeTicket: Handler = async(req, res) =>{
  try {
    const order = await Order.findById(req.body.id)
    if (!order) throw new Error("Ordem não encontrada")

    order.status = 'approved'
    order.expireAt = null
    await order.save()

    const slot = await Slot.findById(order.slot)
    slot.status = 'owned'
    slot.expireAt = null
    await slot.save()

    addBalance(order.user, order.paymentTotal)

    res.status(200).send("Autorizado")
  } catch (error) {
    res.status(400).send("Erro ao autorizar")
  }
}

const addBalance = async (affiliateId: string, total: number) => {
  const indication = await User.findOne({indications: affiliateId})
  const config = await Config.find()
  if (!config) throw new Error("Nenhuma configuração encontrada")
  const share = total * (config[0].affiliateShare/100)
  indication?.balance += share
  await indication.save()

  const affiliate = new Affiliate({affiliate: indication._id, transaction: total, share, indication: affiliateId})
  await affiliate.save()
}

export const deleteOrder: Handler = async (req, res) =>{
  try {
    const order = await Order.findOne({_id: req.params.id})
    await Slot.findByIdAndRemove(order.slot)
    await order.remove()
    res.status(200).send("Removido")
  } catch (error) {
    res.status(400).send("Erro ao remover")
  }
}

const reserveSlots = async(raffleId: string, userId: string, slots: Array<number>) => {
  const raffle = await Raffle.findById(raffleId)
  if (!raffle) throw new Error()
  const slot = new Slot({slots, owner: userId, raffle: raffleId})
  slot.owner = userId
  slot.raffle = raffleId
  await slot.save()

  const countChosen = slots.length
  const available = raffle.available - countChosen > 0 ? raffle.available - countChosen : 0
  raffle.available = available
  await raffle.save()

  return {slot, price: raffle.ticketPrice}
}

const generateOrder = async(
  slots: any,
  price: number,
  userId: string,
  preferenceId:string = '',
  ) => {
  const order = new Order({
    paymentTotal: slots.slots.length * price,
    deadline: DateTime.now().plus({hours: 72}).toISO(),
    user: userId,
    preferenceId: preferenceId,
    slot: slots._id
  })

  await order.save()
  return order
}

export const createBuyOrder: Handler = async(req, res) => {
  try{
    const result = await reserveSlots(req.body.raffleId, req.user._id, req.body.slots)
    const order = await generateOrder(result.slot, result.price, req.user._id)
    result.slot.order = order._id
    await result.slot.save()

    res.status(201).send({order, slot: result.slot})
  } catch(e){
    res.status(400).send("Erro ao criar ordem de pagamento")
    console.log(e)
  }
}

export const payWithMP: Handler = async(req, res) => {
  try {
    const {raffleId, orderId} = req.body
    const raffle = await Raffle.findById(raffleId)
    if (!raffle) throw new Error("Sorteio não encontrado")

    const order = await Order.findById(orderId).populate('slot', 'slots')
    if (!order) throw new Error("Ordem não encontrada")

    const items: PreferenceItem = {
      id: raffleId,
      title: raffle.title,
      description: raffle.title,
      quantity: parseInt(order.slot.slots.length),
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
      external_reference : raffleId,
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
    order.preferenceId = preference.body.id
    await order.save()

    if (process.env.NODE_ENV === 'production'){
      return res.send({url: `${preference.body.init_point}`, prefId: preference.body.id, orderId: order._id});    
    } else{
      return res.send({url: `${preference.body.sandbox_init_point}`, prefId: preference.body.id, orderId: order._id});  
    }
  } catch (error) {
    res.status(400).send("Erro ao tentar pagamento via Mercado Pago")
    console.log(error)
  }
}