import { Handler } from "routers/types";
import Raffle from "db/models/Raffle";
import Slot from "db/models/Slot";
import Order from "db/models/Order";

export const selectRaffleSlot: Handler = async(req, res) => {
  try {
    const raffle = await Raffle.findById(req.params.id)
    if (!raffle) throw new Error()
    const slot = new Slot(req.body)
    slot.owner = req.user._id
    slot.raffle = req.params.id
    await slot.save()

    const countChosen = req.body.slots.length
    const available = raffle.available - countChosen > 0 ? raffle.available - countChosen : 0
    raffle.available = available
    await raffle.save()

    res.status(200).send(slot)
  } catch (error) {
    res.status(400).send("Não foi possível adquirir bilhete")
    console.log(error)
  }
}

export const cancelSlot: Handler = async(req, res) => {
  try {
    const slot = await Slot.findById(req.body.id)
    if (slot.status === 'owned') throw new Error()
    const raffle = await Raffle.findById(slot.raffle)
    raffle.available += slot.slots.length
    await raffle.save()

    await Slot.deleteOne(slot)
    await Order.findOneAndDelete({slot: req.body.id})
    res.status(200).send("Números removidos com sucesso")
  } catch (error) {
    res.status(400).send("Erro ao remover números")
  }
}

export const getUserSlots: Handler = async(req, res) => {
  try {
    const slots = await Slot.find({owner: req.user._id, raffle: req.params.id}).select('slots')
    res.status(200).send(slots)
  } catch (error) {
    res.status(204).send()
  }
}