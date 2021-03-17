const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/web-grep')

const PullSchema = Schema({
  lastUpdatedOn: { type: Date, default: Date.now },
  status: { type: String, enum: ['N/A', 'Healthy', 'Error'] },
  statusMessage: { type: Object },
  repo: { type: Schema.Types.ObjectId, ref: 'Repo' }
})

PullSchema.pre(['update'], async (err) => {
  if (err) {
    throw new Error(err)
  }
  this.set({ updatedAt: new Date() })
})

const PullModel = new mongoose.model('Pull', PullSchema)

module.exports = PullModel
