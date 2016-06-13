const Promise = require('bluebird')
const testQueue = require('./test-queue')
const testMockQueue = require('./test-mock-queue')
const dbAssertDatabase = require('./db-assert-database.spec')
const dbAssertTable = require('./db-assert-table.spec')
const dbAssertIndex = require('./db-assert-index.spec')
const dbAssert = require('./db-assert.spec')
const enums = require('./enums.spec')
const jobOptions = require('./job-options.spec')
const job = require('./job.spec')
const jobAddLog = require('./job-add-log.spec')
const dbResult = require('./db-result.spec')
const queueAddJob = require('./queue-add-job.spec')
const jobCompleted = require('./job-completed.spec')
const jobFailed = require('./job-failed.spec')
const dbReview = require('./db-review.spec')
const queueStatusSummary = require('./queue-status-summary.spec')

return dbAssertDatabase().then(() => {
}).then(() => {
  return dbAssertTable()
}).then(() => {
  return dbAssertIndex()
}).then(() => {
  return dbAssert()
}).then(() => {
  // Note: must drain the rethinkdbdash pool or node will not exit gracefully.
  testMockQueue().r.getPoolMaster().drain()
  return Promise.all([
    enums(),
    jobOptions(),
    job(),
    jobAddLog(),
    dbResult(),
    queueAddJob(),
    jobCompleted(),
    jobFailed()
  ])
}).then(() => {
  return dbReview()
}).then(() => {
  return queueStatusSummary()
}).then(() => {
  // Note: must drain the rethinkdbdash pool or node will not exit gracefully.
  testQueue().stop(100)
  return true
})
