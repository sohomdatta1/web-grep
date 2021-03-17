const mongoose = require('mongoose')
const isUrl = require('is-url')
const Schema = mongoose.Schema
const RepoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: () => {
      return isUrl(this.url)
    }
  },
  blurb: { type: String, default: '' },
  src: String,
  updateInterval: Number,
  status: { type: String, enum: ['ToBeCreated', 'Cloned', 'Error'] },
  statusMessage: { type: Object },
  pullStatus: { type: Schema.Types.ObjectId, ref: 'Pull' }

})

const RepoModel = new mongoose.model('Repo', RepoSchema)

module.exports = RepoModel
