const Promise = require('bluebird')
const serializeError = require('serialize-error')
const logger = require('./logger.spec')
const errorBooster = require('./error-booster.spec')
const enums = require('./enums.spec')
const is = require('./is.spec')
const datetime = require('./datetime.spec')
const dbDriver = require('./db-driver.spec')
const dbAssertDatabase = require('./db-assert-database.spec')
const dbAssertTable = require('./db-assert-table.spec')
const dbAssertIndex = require('./db-assert-index.spec')
const dbAssert = require('./db-assert.spec')
const dbResult = require('./db-result.spec')
const dbReview = require('./db-review.spec')
const job = require('./job.spec')
const jobOptions = require('./job-options.spec')
const jobParse = require('./job-parse.spec')
const jobProgress = require('./job-progress.spec')
const jobUpdate = require('./job-update.spec')
const jobCompleted = require('./job-completed.spec')
const jobFailed = require('./job-failed.spec')
const jobLog = require('./job-log.spec')
const queue = require('./queue.spec')
const queueDb = require('./queue-db.spec')
const queueState = require('./queue-state.spec')
const queueAddJob = require('./queue-add-job.spec')
const queueGetJob = require('./queue-get-job.spec')
const queueFindJob = require('./queue-find-job.spec')
const queueFindJobByName = require('./queue-find-job-by-name.spec')
const queueGetNextJob = require('./queue-get-next-job.spec')
const queueReanimateJob = require('./queue-reanimate-job.spec')
const queueProcess = require('./queue-process.spec')
const queueChange = require('./queue-change.spec')
const queueInterruption = require('./queue-interruption.spec')
const queueCancelJob = require('./queue-cancel-job.spec')
const queueRemoveJob = require('./queue-remove-job.spec')
const queueReset = require('./queue-reset.spec')
const queueStop = require('./queue-stop.spec')
const queueDrop = require('./queue-drop.spec')
const queueSummary = require('./queue-summary.spec')

testRunner()
async function testRunner () {
  try {
    await dbAssertDatabase()
    await dbAssertTable()
    await dbAssertIndex()
    await dbAssert()
    await queueReset()
    await Promise.all([
        logger(),
        dbDriver(),
        errorBooster(),
        enums(),
        is(),
        datetime(),
        jobOptions(),
        jobParse(),
        job(),
        jobProgress(),
        jobLog(),
        jobUpdate(),
        queueGetJob(),
        queueFindJob(),
        queueFindJobByName(),
        dbResult(),
        queueAddJob(),
        queueRemoveJob(),
        jobCompleted(),
        jobFailed()
    ])
    await queueInterruption()
    await dbReview()
    await queueSummary()
    await queueReset()
    await queueGetNextJob()
    await queueReanimateJob()
    await queueCancelJob()
    await queueDb()
    await queueState()
    await queueProcess()
    await queueChange()
    await queue()
    await queueStop()
    await queueDrop()
  } catch (err) {
    console.log(serializeError(err))
  }
}
