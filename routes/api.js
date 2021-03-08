const express = require( 'express' );
const mongoose = require( 'mongoose' );
const RepoModel = require( '../utils/mongooseModels/Repo' );
const router = express.Router();
const isUrl = require( 'is-url' );
mongoose.connect( 'mongodb://localhost/web-grep' );

const { Worker } = require( 'worker_threads' );

/** Start up Worker thread */

const gitWorker = new Worker( './utils/git/gitWorker.js' );

router.post( '/add_repo', function ( req, res ) {
  console.log( req.body );

  if ( !req.body || !req.body.name || !req.body.url || !isUrl( req.body.url ) ) {
    res.json( {
      status: false,
      statusMessage: 'Failed',
      error: 'Invalid Input!',
    } );
    return;
  }

  var repo = new RepoModel( {
    name: req.body.name,
    url: req.body.url,
    blurb: req.body.blurb || '',
    reIndexInterval: req.body.reIndexInterval || 14400,
  } );
  repo.save( ( err ) => {
    if ( err ) {
      res.json( { status: false, statusMessage: 'Failed', error: err } );
      return;
    }

    gitWorker.postMessage( req.body.name );

    res.json( {
      status: true,
      statusMessage: 'Success',
      message: 'Registered repository, will index in due time.',
    } );
  } );
} );

router.get( '/config', function ( req, res ) {
  RepoModel.find( {}, ( err, docs ) => {
    if ( err ) {
      res.json( err );
      return;
    }

    // removing housekeeping fields like _id and __v
    let responseConfig = docs.map( ( x ) => ( {
      name: x.name,
      url: x.url,
      blurb: x.blurb,
      reIndexInterval: x.reIndexInterval,
      lastUpdatedOn: x.lastUpdatedOn
    } ) );

    console.log( err, responseConfig );
    res.json( responseConfig );
  } );
} );

module.exports = router;
