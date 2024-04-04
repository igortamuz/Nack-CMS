import Config from "db/models/Config";
import { Handler } from "routers/types";

export const editConfig: Handler = async (req, res) => {
  try {
    const config = await Config.findById(req.body.id)
    config.affiliateShare = req.body.affiliateShare
    await config.save()

    res.status(200).send("Configuração editada")
  } catch (error) {
    res.status(400).send("Erro ao editar")
  }
}

export const getConfig: Handler = async(req, res) => {
  try {
    const config = await Config.find().select('affiliateShare')
    res.status(200).send(config[0])
  } catch (error) {
    res.status(204).send()
  }
}

export const createConfig: Handler = async(req, res) => {
  try {
    const exists = await Config.find()
    if (Object.keys(exists).length > 0) throw new Error("Já existe uma configuração")

    const config = new Config()
    await config.save()
    res.status(200).send("Configuração criada")
  } catch (error) {
    console.log(error)
    res.status(400).send("Não é possível realizar essa operação")
  }
}