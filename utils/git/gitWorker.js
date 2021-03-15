const mongoose = require('mongoose')
const { parentPort } = require('worker_threads')
const RepoModel = require('../mongooseModels/Repo')
const { cloneProject, pullProject } = require('./gitUpdateFunctions')
mongoose.connect('mongodb://localhost/web-grep')

const registerUpdaters = (repoPath, interval) => {
  setInterval((repoPath) => {
    pullProject(repoPath)
  }, interval)
}

const cloneRepoAndUpdateDB = (url, name) => {
  let cloneDest
  try {
    cloneDest = cloneProject(url, name)
  } catch (e) {
    RepoModel.findOneAndUpdate({ name: name, url: url }, { status: 'Error', statusMessage: e }, (err) => {
      throw new Error(err)
    })
  }

  RepoModel.findOneAndUpdate({ name: name, url: url }, { src: cloneDest, status: 'Healthy' }, (err) => {
    if (err) { throw new Error(err) }
  })
}

parentPort.on('message', (message) => {
  cloneRepoAndUpdateDB(message.url, message.name)
})

RepoModel.find({}, (err, docs) => {
  if (err) { throw new Error(err.message) }
  docs.forEach((elem) => {
    if (elem.status === 'ToBeCreated') {
      cloneRepoAndUpdateDB(elem.url, elem.name)
    }
    registerUpdaters(elem.src, elem.reIndexInterval)
  })
})
