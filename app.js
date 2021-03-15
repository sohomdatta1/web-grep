const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'ui/build')))
app.use(cors())

app.use('/api', apiRouter)
app.use('/*', indexRouter)

module.exports = app
