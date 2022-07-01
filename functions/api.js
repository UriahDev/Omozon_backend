// This is your test secret API key.
require('dotenv').config()
const stripe = require('stripe')(process.env.SECRET_KEY)
const express = require('express')
const serverless = require('serverless-http')
const cors = require('cors')

const router = express.Router()
const app = express()

//Setting up middlewares
app.use(express.json())
app.use(cors({
    origin: 'https://omozon.netlify.app',
    credentials: true
}))

const YOUR_DOMAIN = process.env.YOUR_DOMAIN

router.post('/create-checkout-session', async (req, res) => {
    const products = req.body.products
    let allProducts = []
    if(products.length !== 0) allProducts.push({price: process.env.PRICE_0, quantity: 1})
    
    products.map(product => {
      let getPrice
      const p = process.env
      switch(product) {
        case 1:
          getPrice = p.PRICE_1
          break
        case 2:
          getPrice = p.PRICE_2
          break
        case 3:
          getPrice = p.PRICE_3
          break
        case 4:
          getPrice = p.PRICE_4
          break
        case 5:
          getPrice = p.PRICE_5
          break
        default:
          //Look for a logic for the default
      }
      //Product Quantity: TODO
      const store = { price: getPrice, quantity: 1 }
      allProducts.push(store)
    })

    const session = await stripe.checkout.sessions.create({
      line_items: allProducts,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    })
    //res.status(303): task
    res.header('Access-Control-Allow-Origin', 'https://omozon.netlify.app')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT')
    res.json(session.url)
})

router.get('/', (req, res) => res.send('Welcome'))

app.use('/.netlify/functions/api', router)

module.exports.handler = serverless(app)