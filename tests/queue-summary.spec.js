const test = require('tape')
const Promise = require('bluebird')
const is = require('../src/is')
const enums = require('../src/enums')
const testError = require('./test-error')
const queueSummary = require('../src/queue-summary')
const queueAddJob = require('../src/queue-add-job')
const testData = require('./test-options').testData
const Queue = require('../src/queue')
const testOptions = require('./test-options')

module.exports = function () {
  return new Promise((resolve, reject) => {
    test('queue-summary', (t) => {
      t.plan(9)

      const q = new Queue(testOptions.queueDefault())
      const jobs = q.createJob(testData, 7)
      jobs[0].status = enums.status.added
      jobs[1].status = enums.status.active
      jobs[2].status = enums.status.completed
      jobs[3].status = enums.status.cancelled
      jobs[5].status = enums.status.failed
      jobs[6].status = enums.status.terminated

      return q.reset().then((resetResult) => {
        t.ok(is.integer(resetResult), 'Queue reset')
        return queueAddJob(q, jobs, true)
      }).then(() => {
        return queueSummary(q)
      }).then((summary) => {
        t.equal(summary.added, 1, 'Queue status summary includes added')
        t.equal(summary.active, 1, 'Queue status summary includes active')
        t.equal(summary.completed, 1, 'Queue status summary includes completed')
        t.equal(summary.cancelled, 1, 'Queue status summary includes cancelled')
        t.equal(summary.failed, 1, 'Queue status summary includes failed')
        t.equal(summary.terminated, 1, 'Queue status summary includes terminated')
        t.equal(summary.total, 7, 'Queue status summary includes total')
        return q.reset()
      }).then((resetResult) => {
        t.ok(resetResult >= 0, 'Queue reset')
        q.stop()
        return resolve(t.end())
      }).catch(err => testError(err, module, t))
    })
  })
}
