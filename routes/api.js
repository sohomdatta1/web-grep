const express = require('express')
const mongoose = require('mongoose')
const RepoModel = require('../utils/mongooseModels/Repo')
const router = express.Router()
const isUrl = require('is-url')
mongoose.connect('mongodb://localhost/web-grep', { useNewUrlParser: true, useUnifiedTopology: true })

// const { Worker } = require( 'worker_threads' );

/** Start up Worker thread */

// const gitWorker = new Worker( './utils/git/gitWorker.js' );

router.post('/add_repo', (req, res) => {
  if (!req.body || !req.body.name || !req.body.url || !isUrl(req.body.url)) {
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
    updateInterval: req.body.updateIntervalInterval || 14400
  })

  repo.save((err) => {
    if (err) {
      res.status(403).json({ status: false, error: err })
      return
    }

    // gitWorker.postMessage( { name: req.body.name, url: req.body.url } );

    res.json({
      status: true,
      message: 'Successfully added repository'
    })
  })
})

router.delete('/remove_repo', (req, res) => {
  if (!req.body.name) {
    res.status(400).json({
      status: false,
      error: 'Invalid name'
    })
  }
  RepoModel.findOneAndDelete({ name: req.body.name }, (err) => {
    if (err) {
      res.status(403).json({ status: false, error: err })
      return
    }

    res.json({
      status: true,
      message: `Deleted ${req.body.name}`
    })
  })
})

router.put('/edit_repo', (req, res) => {
  if (!req.body.name) {
    res.status(400).json(
      {
        status: false,
        error: 'Invalid Input!'
      }
    )
  }

  RepoModel.findOneAndUpdate({ name: req.body.name }, {
    ...(req.body.url) && { url: req.body.url },
    ...(req.body.blurb) && { blurb: req.body.blurb },
    ...(req.body.updateInterval) && { updateInterval: req.body.updateInterval }
  }, (err) => {
    if (err) {
      res.status(403).json({ status: false, error: err })
      return
    }

    res.json({
      status: true,
      message: `Updated ${req.body.name}`
    })
  })
})

router.get('/list_repos', (req, res) => {
  RepoModel.find({}, (err, docs) => {
    if (err) {
      res.json({ list: [], error: err })
      return
    }

    // removing housekeeping fields like _id and __v
    const responseConfig = docs.map((x) => ({
      name: x.name,
      url: x.url,
      blurb: x.blurb,
      updateInterval: x.updateInterval
    }))

    console.log(err, responseConfig)
    res.json({ list: responseConfig || [] })
  })
})

module.exports = router
