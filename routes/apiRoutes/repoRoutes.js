const express = require('express')
const RepoModel = require('../../utils/mongooseModels/Repo')
const router = express.Router()
const isUrl = require('is-url')

const { Worker } = require('worker_threads')

/** Start up Worker thread */
const checkTypeForAddRepo = (req) => {
  return !req.body ||
    !req.body.name ||
    !typeof req.body.name === 'string' ||
    !req.body.url ||
    !isUrl(req.body.url)
}

const gitWorker = new Worker('./gitWorker/worker.js')

router.post('/add_repo', async (req, res) => {
  if (checkTypeForAddRepo(req)) {
    res.status(400).json({
      status: false,
      error: 'Invalid input!'
    })
    return
  }

  const repo = new RepoModel({
    name: req.body.name,
    url: req.body.url,
    blurb: req.body.blurb || '',
    updateInterval: req.body.updateInterval || 14400
  })

  try {
    await repo.save()
  } catch (e) {
    console.log('/add_repo: Error: ', e)
    res.status(403).json({ status: false, error: e })
    return
  }

  gitWorker.postMessage({
    action: 'add',
    details: {
      name: req.body.name
    }
  })

  res.json({
    status: true,
    message: 'Successfully added repository'
  })
})

router.delete('/remove_repo', async (req, res) => {
  if (!req.body.name || !typeof req.body.name === 'string') {
    res.status(400).json({
      status: false,
      error: 'Invalid name'
    })
    return
  }

  try {
    await RepoModel.findOneAndDelete({ name: req.body.name })
  } catch (e) {
    console.log('/remove_repo Error: ', e)
    res.status(403).json({ status: false, error: e })
    return
  }

  gitWorker.postMessage({
    action: 'delete',
    details: {
      name: req.body.name
    }
  })

  res.json({
    status: true,
    message: `Deleted ${req.body.name}`
  })
})

router.put('/edit_repo', async (req, res) => {
  if (!req.body.name || !typeof req.body.name === 'string') {
    res.status(400).json(
      {
        status: false,
        error: 'Invalid Input!'
      }
    )
    return
  }

  try {
    await RepoModel.findOneAndUpdate({ name: req.body.name }, {
      ...(req.body.url) && { url: req.body.url },
      ...(req.body.blurb) && { blurb: req.body.blurb },
      ...(req.body.updateInterval) && { updateInterval: req.body.updateInterval }
    })
  } catch (e) {
    console.log('/edit_repo Error: ', e)
    res.status(403).json({ status: false, error: e })
    return
  }

  gitWorker.postMessage({
    action: 'edit',
    details: {
      name: req.body.name,
      changed: {
        ...(req.body.url) && { url: req.body.url },
        ...(req.body.updateInterval) && { updateInterval: req.body.updateInterval }
      }
    }
  })

  res.json({
    status: true,
    message: `Updated ${req.body.name}`
  })
})

router.get('/list_repos', async (req, res) => {
  let docs
  try {
    docs = await RepoModel.find({}).exec()
  } catch (e) {
    console.log('/list_repos: Error: ', e)
    res.json(403).json({ list: [], error: e })
  }

  // removing housekeeping fields like _id and __v
  const responseConfig = docs.map((x) => ({
    name: x.name,
    url: x.url,
    blurb: x.blurb,
    updateInterval: x.updateInterval
  }))

  console.log(responseConfig)
  res.json({ list: responseConfig || [] })
})

module.exports = router
