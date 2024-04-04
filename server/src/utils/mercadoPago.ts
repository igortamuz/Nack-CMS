import mercadopago from 'mercadopago'

mercadopago.configure({
  sandbox: true,
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
})