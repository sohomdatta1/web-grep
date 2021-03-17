const mongoose = require('mongoose')
const { parentPort } = require('worker_threads')
const RepoModel = require('../utils/mongooseModels/Repo')
const { createPullModel, cloneRepoAndUpdateDB, registerUpdaters } = require('./helperFunctions')
mongoose.connect('mongodb://localhost/web-grep', { useNewUrlParser: true, useUnifiedTopology: true })

// main

parentPort.on('message', async (message) => {
  console.log(message)
  let doc
  try {
    doc = await RepoModel.findOne({ name: message.details.name })
  } catch (e) {
    console.log('Failed to fetch repo values', e)
    return
  }

  console.log(doc)
  switch (message.action) {
    case 'add':
    case 'delete':
    case 'edit':
    default:
      // do something
  }
  /*
  try {
    const cloneDest = await cloneRepoAndUpdateDB(message.url, message.name, message._id)
    const pullId = await createPullModel(message._id)
    await registerUpdaters(cloneDest, message.updateInterval, pullId)
  } catch (e) {
  }
  */
})

const main = async () => {
  let docs
  try {
    docs = await RepoModel.find({})
  } catch (e) {
    console.log('Failed to fetch repo values', e)
    return
  }

  docs.forEach(async (elem) => {
    if (elem.status === 'ToBeCreated' || !elem.status || elem.status === 'Error') {
      const cloneDest = await cloneRepoAndUpdateDB(elem.url, elem.name, elem._id)
      const pullId = await createPullModel(docs._id)
      registerUpdaters(cloneDest, elem.updateInterval, pullId)
    } else {
      if (elem.pullStatus) {
        console.log(elem)
        await registerUpdaters(elem.src, elem.updateInterval, elem.pullStatus._id)
      } else {
        const pullId = await createPullModel(elem._id)
        console.log(pullId, elem.src, elem.pullStatus, elem.updateInterval)
        await registerUpdaters(elem.src, elem.updateInterval, pullId)
      }
    }
  })
}

main()
