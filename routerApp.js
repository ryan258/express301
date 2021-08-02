// this will be the main express server
// - breaking out the routes to their own things will allow to keep things very clean

const express = require('express')
const app = express()
const helmet = require('helmet')
// these will be available through the whole application and get run first
app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

const router = require('./theRouter')
const userRouter = require('./userRouter')

app.use('/', router)
// app.use('/admin', adminRouter)
app.use('/user', userRouter)

app.listen(3000)
