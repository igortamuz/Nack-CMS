import path from 'path'
import fs from 'fs'
import https from 'https'
import axios from 'axios'

const pixAuthApi = "/oauth/token"
export const gerenciaNetPixApi = process.env.GERENCIANET_PIX_API_PRODUCAO
// export const gerenciaNetPixApi = process.env.NODE_ENV === 'production'
//   ? process.env.GERENCIANET_PIX_API_PRODUCAO
//   : process.env.GERENCIANET_PIX_API_HOMOLOGACAO

const credentials = () => {
  const certPath = path.resolve('certs', process.env.GERENCIANET_PIX_CERTIFICADO_PRODUCAO)

  const certificado = fs.readFileSync(certPath)
  const agent = new https.Agent({pfx: certificado, passphrase: ""})
  const credentials = `${process.env.GERENCIANET_CLIENT_ID}:${process.env.GERENCIANET_CLIENT_SECRET}`
  const authCredentials = Buffer.from(credentials).toString("base64")

  return {authCredentials, agent}
}

export const authenticate = async() => {
  try {
    const {agent, authCredentials} = credentials()

    const response = await axios({
      method: 'POST', 
      url: gerenciaNetPixApi + pixAuthApi,
      headers: {
        'Authorization': "Basic " + authCredentials,
        'Content-Type': 'application/json'
      },
      httpsAgent: agent,
      data: {
        grant_type: 'client_credentials'
      }
    })
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + response.data.access_token
    }
    return {headers, agent}
  } catch (error) {
    return undefined
  }
  
}
