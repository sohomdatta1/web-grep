const SimpleGit = require('simple-git')
const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const universalGit = SimpleGit()
const repoPath = '/tmp/web-grep/repos'
const mkdir = promisify(fs.mkdir)

const cloneProject = async (repoUrl, repoName, repoId) => {
  console.log(repoId)
  const actualPath = await normalizeRepoPath(repoName + repoId)
  await mkdir(actualPath, { recursive: true })
  console.log(universalGit.clone(repoUrl, path.join(actualPath, 'src/'), [], (err) => {
    console.log(err)
  }))
  return actualPath
}

const normalizeRepoPath = async (dirname) => {
  const ultimatePath = await path.resolve(repoPath, dirname)
  if (ultimatePath.indexOf(repoPath) === -1) {
    throw new Error('Possibly out of intended directory')
  } else {
    return ultimatePath
  }
}

const pullProject = async (repoPath) => {
  console.log('RepoPath', repoPath)
  const gitForRepoPath = SimpleGit(path.join(repoPath, 'src'))
  await gitForRepoPath.pull(['--all'])
}

module.exports = {
  cloneProject: cloneProject,
  pullProject: pullProject
}
