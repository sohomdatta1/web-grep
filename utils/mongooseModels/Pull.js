const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/web-grep')

const PullSchema = Schema({
  lastUpdatedOn: { type: Date, default: Date.now },
  status: { type: String, enum: ['N/A', 'Healthy', 'Error'] },
  statusMessage: { type: Object }
})

module.exports = PullSchema
