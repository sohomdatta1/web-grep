const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/web-grep', { useNewUrlParser: true, useUnifiedTopology: true })

const indexRouter = require('./routes/index')
const repoRouter = require('./routes/apiRoutes/repoRoutes')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'ui/build')))
app.use(cors())

app.use('/api/repos', repoRouter)
app.use('/*', indexRouter)

module.exports = app
