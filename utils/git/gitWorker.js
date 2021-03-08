const mongoose = require( 'mongoose' );
const { parentPort } = require( 'worker_threads' );
const RepoModel = require( '../mongooseModels/Repo' );
const { cloneProject, pullProject } = require( './gitUpdateFunctions' );
mongoose.connect( 'mongodb://localhost/web-grep' );

const registerUpdaters = ( repoPath, interval ) => {
  setInterval( ( repoPath ) => {
    pullProject( repoPath );
  }, interval )
};

parentPort.on( 'message', ( message ) => {
  console.log( message );
} )

RepoModel.find( {}, (err, docs) => {
  if ( err )
    throw new Error( err.message );
  docs.forEach( ( elem ) => {
    if ( elem.status === 'ToBeCreated' ) {
      cloneProject( elem.url, elem.name );
    }
    registerUpdaters( elem.src, elem.reIndexInterval );
  } )
} )
