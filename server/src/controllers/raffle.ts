import path from 'path'
import fs from 'fs'
import { Handler } from "routers/types";
import Raffle from "db/models/Raffle"
import Slot from "db/models/Slot";
import { DateTime } from 'luxon';
import Image from 'db/models/Image';

const url = process.env.NODE_ENV === 'production' ? 'https://gosorte.com/static/'
    : 'http://localhost:3005/static/'

export const getAll: Handler = async(req, res) => {
  try {
    const raffle = await Raffle.find().populate('slots', ['slots', 'status'])
    res.status(200).send(raffle)
  } catch (error) {
    res.status(204).send("Nenhum sorteio encontrado")
  }
}

export const getAvailable: Handler = async (req, res) => {
  try {
    const raffle = await Raffle.find({status: true, raffled: 'unraffled'})
      .populate('image', 'filename')
      .populate({
        path: 'slots',
        select: ['owner', 'slots'],
        populate: {
          path: 'owner',
          select: ['avatar']
        }
      })
    res.status(200).send({raffle, url})
  } catch (error) {
    res.status(204).send("Nenhum sorteio encontrado")
  }
}

export const getUserRaffles: Handler = async(req, res) => {
  try {
    const slots = await Slot.find({owner: req.user._id})
      .populate({
        path: 'raffle',
        select: ['title', 'prize', 'image'],
        populate: {path: 'image', select: ['filename']}
      })
      .populate({
        path: 'order',
        select: ['preferenceId', 'status', 'expireAt', 'deadline'],
      })
    res.status(200).send({slots, url})
  } catch (error) {
    res.status(204).send()
  }
}

export const createRaffle: Handler = async(req, res) => {
  try {
    const raffle = new Raffle({...req.body,
      quickRaffle: req.body.isQuick,
      available: req.body.numberOfSlots,
      imagesRaffle: req.body.imagesRaffle.flat()
    })
    await raffle.save()
    res.status(201).send("Sorteio criado com sucesso")
  } catch (error) {
    res.status(400).send("Não foi possível criar o sorteio")
  }
}

export const getOneById: Handler = async(req, res) => {
  try {
    const raffle = await Raffle.findById(req.params.id)
      .populate('image', "filename")
      .populate('imagesRaffle', "filename")
    if (!raffle) throw new Error("Sorteio não encontrado")

    const allSlots = await Slot.find({raffle: raffle._id}).populate('owner', 'name')
    let ownedTickets: Array<any> = []
    let reservedTickets: Array<any> = []

    allSlots.map((slot: any) => slot.status === 'owned' ?
     ownedTickets.push({slots: slot.slots.flat(), owner: slot.owner.name})
     : reservedTickets.push({slots: slot.slots.flat(), owner: slot.owner.name})
    )
    res.status(200).send({raffle, ownedTickets, reservedTickets, url})
  } catch (error) {
    res.status(400).send("Não foi possível encontrar o sorteio")
  }
}

export const getWinner: Handler = async(req, res) => {
  try {
    const raffle = await Raffle.findById(req.params.id)
      .populate({
        path: "winner",
        select: ['name', 'avatar']
      })
    res.status(200).send(raffle)
  } catch (error) {
    res.status(400).send("Não foi possível encontrar o sorteio")
  }
}

export const getLastWinners: Handler = async(req, res) => {
  try {
    const raffles = await Raffle.find({raffled: 'raffled'})
      .sort({drawDate: -1})
      .limit(5)
      .populate('winner', 'name')
      .populate('image', 'filename')
    res.status(200).send({raffles, url})
  } catch (error) {
    res.status(204).send("None found")
  }
}

export const editRaffle: Handler = async (req, res) => {
  try {
    const raffleId = req.params.id
    const updates = Object.keys(req.body)
    const raffle = await Raffle.findById(raffleId).populate('imagesRaffle', 'filename')
    updates.forEach((update: string) => {
      if (update === 'isQuick'){
        raffle.quickRaffle = req.body.isQuick
      } else if(update === 'image' && req.body.image !== undefined){
        raffle[update] = req.body[update]
      }  else if (update === 'imagesRaffle' && 
        (req.body.imagesRaffle !== undefined || req.body.imagesRaffle.length > 0)){
          raffle.imagesRaffle?.map((image: any) => {
            const imagePath = path.resolve('public', image.filename)
            fs.rmSync(imagePath)
            Image.findByIdAndDelete(image._id)
          })
          raffle[update] = req.body.imagesRaffle.flat()
      } else{
        raffle[update] = req.body[update]
      }
    })

    await raffle.save()
    res.status(200).send("Sorteio editado com sucesso")
  } catch (error) {
    res.send("Sorteio não encontrado")
  }
}

export const endRaffle: Handler = async (req, res) => {
  try {
    const raffleId = req.body.id

    const raffle = await Raffle.findOne({_id: raffleId, raffled: 'unraffled'})
    if (!raffle) throw new Error("Nenhum sorteio encontrado")

    const winnerSlot = await Slot.findOne({slots: req.body.sorted})
    if (winnerSlot.length === 0) throw new Error("Nenhum ganhador encontrado")

    raffle.winner = winnerSlot.owner
    raffle.raffled = 'raffled'
    raffle.drawDate = DateTime.now().toISO()

    await raffle.save()
    res.status(200).send(winnerSlot)
  } catch (error) {
    res.status(400).send("Erro ao finalizar")
  }
}

export const changeRaffleStatus: Handler = async(req, res) => {
  try {
    const raffle = await Raffle.findById(req.params.id)
    raffle.status = !raffle.status
    await raffle.save()
    res.status(200).send(raffle.status)
  } catch (error) {
    res.status(400).send("Erro ao atualizar status")
  }
}

export const deleteRaffle: Handler = async(req, res) => {
  try {
    const {id} = req.params
    await Raffle.findByIdAndDelete(id)
    res.status(200).send("Removido")
  } catch (error) {
    res.status(400).send("Erro ao remover")
  }
}