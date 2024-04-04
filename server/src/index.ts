import "dotenv/config"
import express from 'express'
import cors from 'cors'
import path from 'path'
import "./utils/mercadoPago"
import {routes} from './routers/routes'
import './db/mongoose'

const app = express()

app.use(express.json())
app.use(cors())
app.use('/static', express.static('public'))

routes.forEach((route) => {
  const {method, path, middleware, handler} = route;
  app[method](path, ...middleware, handler)
})

if (process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, './build')))
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, './build', 'index.html'))
  })
}

app.listen(process.env.PORT, () => {
  console.log("Servidor iniciado na porta ", process.env.PORT)
})