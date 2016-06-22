const logger = require('./logger')(module)
const moment = require('moment')
const dbResult = require('./db-result')
const enums = require('./enums')

let dbReviewIntervalId = false
module.exports.isEnabled = function reviewIsEnabled () {
  return !!dbReviewIntervalId
}

function jobReview (q) {
  logger('jobReview: ' + moment().format('YYYY-MM-DD HH:mm:ss.SSS'))

  return q.r.db(q.db).table(q.name)
  .orderBy({index: enums.index.active_retry_dateRetry})
  .filter(
    q.r.row('dateRetry').lt(q.r.now())
  ).update({
    status: q.r.branch(
      q.r.row('retryCount').lt(q.r.row('retryMax')),
      enums.jobStatus.timeout,
      enums.jobStatus.failed
    ),
    priority: q.r.branch(
      q.r.row('retryCount').lt(q.r.row('retryMax')),
      enums.priority.retry,
      q.r.row('priority')
    ),
    dateTimeout: q.r.now(),
    dateFailed: q.r.branch(
      q.r.row('retryCount').lt(q.r.row('retryMax')),
      null,
      q.r.now()
    ),
    retryCount: q.r.branch(
      q.r.row('retryCount').lt(q.r.row('retryMax')),
      q.r.row('retryCount').add(1),
      q.r.row('retryCount')
    ),
    log: q.r.row('log').append({
      date: q.r.now(),
      queueId: q.id,
      type: q.r.branch(
        q.r.row('retryCount').lt(q.r.row('retryMax')),
        enums.log.warning,
        enums.log.error
      ),
      status: q.r.branch(
        q.r.row('retryCount').lt(q.r.row('retryMax')),
        enums.jobStatus.timeout,
        enums.jobStatus.failed
      ),
      message: enums.message.timeout,
      duration: q.r.now().toEpochTime()
        .sub(q.r.row('dateStarted').toEpochTime())
        .mul(1000).round()
    })
  })
  .run()
  .then((updateResult) => {
    return dbResult.status(q, updateResult, 'replaced')
  }).then((replaceCount) => {
    q.emit(enums.queueStatus.review, replaceCount)
    return replaceCount
  })
}

module.exports.enable = function reviewEnable (q) {
  logger('db-review enable')
  if (dbReviewIntervalId) {
    return
  }
  const interval = q.masterReviewPeriod * 1000
  q.emit(enums.queueStatus.reviewEnabled)
  dbReviewIntervalId = setInterval(() => {
    return jobReview(q)
  }, interval)
}

module.exports.disable = function reviewDisable (q) {
  logger('db-review disable')
  if (dbReviewIntervalId) {
    q.emit(enums.queueStatus.reviewDisabled)
    clearInterval(dbReviewIntervalId)
    dbReviewIntervalId = false
  }
}

module.exports.runOnce = jobReview
