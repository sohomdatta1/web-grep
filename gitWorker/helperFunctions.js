const RepoModel = require('../utils/mongooseModels/Repo')
const PullModel = require('../utils/mongooseModels/Pull')
const { cloneProject, pullProject } = require('../utils/git/updateFunctions')

const registerUpdaters = async (repoPath, interval, _id) => {
  console.log(interval)
  return setInterval(async () => {
    try {
      pullProject(repoPath)
    } catch (e) {
      console.log('Error in pull: ', e)
      await PullModel.findByIdAndUpdate(_id, { status: 'Error', statusMessage: e })
      return
    }
    await PullModel.findByIdAndUpdate(_id, { status: 'Healthy' })
  }, interval * 1000)
}

const createPullModel = async (_id) => {
  const pullObj = new PullModel({ repo: _id })
  console.log(await PullModel.find({}))
  try {
    await pullObj.save()
  } catch (e) {
    console.log('PullObj.save failure', e)
  }
  await RepoModel.findByIdAndUpdate(_id, { pullStatus: pullObj._id })

  await PullModel.findById(pullObj._id).populate('repo')
  await RepoModel.findById(_id).populate('pullStatus')
  return pullObj._id
}

const cloneRepoAndUpdateDB = async (url, name, id) => {
  let cloneDest
  try {
    cloneDest = await cloneProject(url, name, id)
    console.log(cloneDest)
  } catch (e) {
    RepoModel.findOneAndUpdate({ name: name, url: url }, { status: 'Error', statusMessage: e }, (err) => {
      throw new Error(err)
    })
    console.log('Clone did not work:', e)
    return
  }

  RepoModel.findOneAndUpdate({ name: name, url: url }, { src: cloneDest, status: 'Cloned' }, (err) => {
    if (err) { throw new Error(err) }
  })

  return cloneDest
}

module.exports = {
  createPullModel: createPullModel,
  cloneRepoAndUpdateDB: cloneRepoAndUpdateDB,
  registerUpdaters: registerUpdaters
}
