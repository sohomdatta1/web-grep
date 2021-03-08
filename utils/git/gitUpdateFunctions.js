const SimpleGit = require( 'simple-git' );
const fs = require( 'fs' );
const { promisify } = require( 'util' );
const universalGit = SimpleGit();
const path = require( 'path' );
const repoPath = 'repos/';
const mkdir = promisify( fs.mkdir );

const cloneProject = async ( repoUrl, nameOfRepo ) => {
  const actualPath = normalizeRepoPath( nameOfRepo );
  await mkdir( actualPath );
  await universalGit.clone( repoUrl, path.join( actualPath, 'src/' ) );
  return actualPath;
};

const normalizeRepoPath = ( dirname ) => {
  const ultimatePath = path.resolve( repoPath, dirname );
  if ( ultimatePath.indexOf( repoPath ) !== -1 ) {
    throw new Error( 'Possibly out of intended directory' );
  } else {
    return ultimatePath;
  }
}

const pullProject = async ( repoPath ) => {
  const gitForRepoPath = SimpleGit( path.join( repoPath, 'src' ) );
  await gitForRepoPath.pull()
}

module.exports = {
  cloneProject: cloneProject,
  pullProject: pullProject
};