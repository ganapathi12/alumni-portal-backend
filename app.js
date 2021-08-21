require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const app = express()
// const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes= require('./routes/auth')


mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('CONNECTED TO MONGODB')
  })

  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors())

  //Routes
  app.use('/api', authRoutes)

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`app is running at ${port}`)
})
