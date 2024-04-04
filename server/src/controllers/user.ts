import path from "path";
import fs from 'fs';
import { Handler } from "routers/types";
import User from "db/models/User"
import sgMail from '@sendgrid/mail'
import Slot from "db/models/Slot";
import Order from "db/models/Order";
import Credit from "db/models/Credit";

export const getAll: Handler = async (req, res) => {
  try{
    const users = await User.find({})
    res.send(users)
  }catch (e){
    res.send(e)
  }
}

export const addUser: Handler = async(req, res) => {
  try {
    const exists = await User.findOne({email: req.body.email})
    if (exists) throw new Error("Usuário existe")

    const avatar = req.file?.filename

    let role = req.body.isAdmin ? 'admin' : ''
    const user = new User({...req.body, role, avatar })
    await user.save()
    res.status(200).send("Sucesso")
  } catch (error) {
    res.status(400).send("Erro ao criar usuário")
  }
}

export const editUser: Handler = async(req, res) => {
  try {
    const {name, email, password} = req.body
    const user = await User.findById(req.body.id)
    if (!user) throw new Error("Usuário não existe")
    user.name = name
    user.email = email
    
    if (password !== undefined || password !== ''){
      user.password = password
    }

    await user.save()
    res.status(200).send("Sucesso")
  } catch (error) {
    res.status(400).send("Erro ao editar usuário")
  }
}

export const updateUser: Handler = async(req, res) => {
  try {
    const avatar = req.file?.filename
    const {name, email, password, state, phone, complement, neighborhood, reference, number, city, street, cep} = req.body

    const user = await User.findById(req.user._id)
    if (!user) throw new Error("Usuário não existe")
    user.name = name
    user.email = email
    user.state = state
    user.phone = phone
    user.complement = complement
    user.neighborhood = neighborhood
    user.reference = reference
    user.number = number
    user.city = city
    user.street = street
    user.cep = cep
    if (avatar !== undefined){
      if(user.avatar !== undefined){
        fs.rmSync(path.resolve('public', user.avatar))
      } 
      user.avatar = avatar
    }
    if (password !== undefined){
      user.password = password
    }

    await user.save()
    res.status(200).send("Sucesso")
  } catch (error) {
    console.log(error)
    res.status(400).send("Erro ao editar usuário")
  }
}

export const getOneUser: Handler = async(req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).send(user)
  } catch (error) {
    res.status(204).send()
  }
}

export const getSelfData: Handler = async(req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).send({user, url})
  } catch (error) {
    res.status(204).send()
  }
}

export const getBalance: Handler = async(req, res) => {
  try {
    const balance = await User.findById(req.user._id).select('balance')
    res.status(200).send(balance)
  } catch (error) {
    res.status(400).send("Erro")
  }
}

const url = process.env.NODE_ENV === 'production' ? 'https://gosorte.com/static/'
  : 'http://localhost:3005/static/'

export const getUserAvatar: Handler = async(req, res) => {
  try {
    const avatar = await User.findById(req.user._id).select('avatar')
    res.status(200).send({avatar, url})
  } catch (error) {
    res.status(204).send()
  }
}

export const createUser: Handler = async (req, res) => {
  try {
    const avatar = req.file?.filename
    const user = new User({...req.body, avatar})
    await user.save()

    if (req.body.affiliatedTo){
      const indication = await User.findById(req.body.affiliatedTo)
      if (indication){
        indication.indications.push(user._id)
        indication.save()
      }
    }
    const token = await user.generateAuthToken()
    res.status(201).send({token})
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

export const removeOne: Handler = async (req, res) => {
  try {
    if (req.user._id === req.params.id) throw new Error()
    const user = await User.findById(req.params.id)
    await User.updateMany({affiliatedTo: user._id}, {affiliatedTo: undefined})
    await Slot.deleteMany({owner: user._id})
    await Order.deleteMany({user: user._id})
    await Credit.deleteMany({user: user._id})

    await user.delete()
    res.send("Deletado com sucesso")
  } catch (error) {
    res.send(error)
  }
}

export const login: Handler = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send(token)
  } catch (error) {
    res.status(400).send("Erro ao tentar entrar")
    console.log(error)
  }
}

export const passwordRecoveryLink: Handler = async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email})
    if (!user) throw new Error()
    
    const recoveryLink = await user.generateRecoveryLink()

    const url = process.env.NODE_ENV === 'production' ? `https://gosorte.com/recuperar-senha/${recoveryLink}` :
      `http://localhost:3000/recuperar-senha/${recoveryLink}`

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: req.body.email,
      from: "noreply@gosorte.com",
      subject: "GoSorte - Recuperação de senha",
      html: `<h1> Clique no link abaixo para prosseguir com a recuperação da sua senha. Caso não tenha requisitado,
       ignore esta mensagem.
        <br/><br/><a href="${url}">Recuperar senha</a><br/><br/>
        <h1>GoSorte</h1>`
    }
    await sgMail.send(msg)
    res.status(200).send("Enviado")
  } catch (error) {
    res.status(200).send("Enviado")
    console.log(error)
  }
}

export const recoveryVerify:Handler = async(req, res) => {
  try {
    const user = await User.findAndVerifyRecoveryLink(req.params.recovery)
    res.status(200).send(user._id)
  } catch (error) {
    res.status(400).send("Inválido")
  }
}

export const newPassword: Handler = async(req, res) => {
  try {
    const user = await User.findById(req.body.userId)
    user.password = req.body.password
    user.recovery = ''
    await user.save()

    res.status(200).send("Sucesso")
  } catch(e) {
    res.status(400).send("Erro")
  }
}