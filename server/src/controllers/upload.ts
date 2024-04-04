import Image, { IImage } from "db/models/Image";
import { Handler } from "routers/types";

export const uploadImage: Handler = async(req, res) => {
  try {
    const {filename, path, originalname} = req.file
    const imageUpload = new Image({filename, path, originalName: originalname})
    await imageUpload.save()
    res.send(imageUpload._id)
  } catch (error) {
    res.send(error)
  }
}

export const uploadRaffleImages: Handler = async(req, res) => {
  try {
    const ids: IImage[] = [];
    (req.files as unknown as Express.Multer.File[])?.map((item: Express.Multer.File) => {
      const {filename, path, originalname} = item
      const imageUpload = new Image({filename, path, originalName: originalname})
      imageUpload.save()
      ids.push(imageUpload._id)
    })
    res.status(200).send(ids)
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
}

export const getAllImages: Handler = async(req, res) => {
  try {
    const images = await Image.find()
    const data: any[] = []
    images.map((image: any) => data.push({
      filename: image.originalName,
      uri: `http://localhost:3005/static/${image.filename}`
    }))
    res.send(data)
  } catch (error) {
    console.log(error)
    res.send('Erro ao buscar imagens')
  }
}