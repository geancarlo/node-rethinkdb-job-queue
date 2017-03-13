const tests = new Map()
const serializeError = require('serialize-error')
tests.set('logger', require('./logger.spec'))
tests.set('errorBooster', require('./error-booster.spec'))
tests.set('enums', require('./enums.spec'))
tests.set('is', require('./is.spec'))
tests.set('datetime', require('./datetime.spec'))
tests.set('dbAssertDatabase', require('./db-assert-database.spec'))
tests.set('dbAssertTable', require('./db-assert-table.spec'))
tests.set('dbAssertIndex', require('./db-assert-index.spec'))
tests.set('dbAssert', require('./db-assert.spec'))
tests.set('dbDriver', require('./db-driver.spec'))
tests.set('dbResult', require('./db-result.spec'))
tests.set('dbReview', require('./db-review.spec'))
tests.set('job', require('./job.spec'))
tests.set('jobOptions', require('./job-options.spec'))
tests.set('jobParse', require('./job-parse.spec'))
tests.set('jobProgress', require('./job-progress.spec'))
tests.set('jobCompleted', require('./job-completed.spec'))
tests.set('jobUpdate', require('./job-update.spec'))
tests.set('jobFailed', require('./job-failed.spec'))
tests.set('jobLog', require('./job-log.spec'))
tests.set('queue', require('./queue.spec'))
tests.set('queueDb', require('./queue-db.spec'))
tests.set('queueState', require('./queue-state.spec'))
tests.set('queueAddJob', require('./queue-add-job.spec'))
tests.set('queueGetJob', require('./queue-get-job.spec'))
tests.set('queueFindJob', require('./queue-find-job.spec'))
tests.set('queueFindJobByName', require('./queue-find-job-by-name.spec'))
tests.set('queueGetNextJob', require('./queue-get-next-job.spec'))
tests.set('queueReanimateJob', require('./queue-reanimate-job.spec'))
tests.set('queueProcess', require('./queue-process.spec'))
tests.set('queueChange', require('./queue-change.spec'))
tests.set('queueInterruption', require('./queue-interruption.spec'))
tests.set('queueCancelJob', require('./queue-cancel-job.spec'))
tests.set('queueRemoveJob', require('./queue-remove-job.spec'))
tests.set('queueReset', require('./queue-reset.spec'))
tests.set('queueStop', require('./queue-stop.spec'))
tests.set('queueDrop', require('./queue-drop.spec'))
tests.set('queueSummary', require('./queue-summary.spec'))

testCurrent()

async function testCurrent () {
  if (tests.has(process.argv[2])) {
    try {
      await tests.get(process.argv[2])()
    } catch (err) {
      console.log(serializeError(err))
    }
  } else {
    const line = '=============================================='
    console.log('\x1b[32m', line, '\x1b[0m')
    console.log('\x1b[36m', '  INVALID TEST NAME!', '\x1b[0m')
    console.log('\x1b[36m', '  Use one of the test names below:', '\x1b[0m')
    console.log('\x1b[32m', line, '\x1b[0m')
    for (let test of tests.keys()) {
      console.log('\x1b[34m', `  ${test}`, '\x1b[0m')
    }
    console.log('\x1b[32m', line, '\x1b[0m')
    console.log('\x1b[36m', '  Example: npm run tc jobOptions', '\x1b[0m')
    console.log('\x1b[32m', line, '\x1b[0m')
  }
}