# Introduction

`rethinkdb-job-queue` is a persistent job or task queue backed by [RethinkDB][rethinkdb-url].
It has been build as an alternative to using a [Redis][redis-url] backed job queue such as [Kue][kue-url], [Bull][bull-url], or [Bee-Queue][bee-queue-url].

[![bitHound Overall Score][bithound-overall-image]][bithound-overall-url]
[![bitHound Dependencies][bithound-dep-image]][bithound-dep-url]
[![bitHound Dependencies][bithound-code-image]][bithound-code-url]
[![js-standard-style][js-standard-image]][js-standard-url]

[![Thinker][thinker-image]][rjq-github-url]

[![NPM][nodei-npm-image]][nodei-npm-url]

Please __Star__ on GitHub / NPM and __Watch__ for updates.

## Features

*   Uses RethinkDB as the backing database.
*   Connect to multiple databases.
*   Create multiple queues.
*   Supports distributed worker nodes.
*   Uses the RethinkDB change feed for global queue events.
*   Run jobs concurrently.
*   Jobs can be configured for a delayed start.
*   Jobs can be cancelled.
*   Jobs can be retried if they fail.
*   Supports priority jobs.
*   Supports job progress updates.
*   Jobs hold a rich history log.
*   Promise based with minimal callbacks.

## Documentation

For full documentation [please see the wiki][rjq-wiki-url]

## Project Status

*   This `rethinkdb-job-queue` module is fully functional.
*   There are over 1100 integration tests.
*   This project is complete and needs to be taken out for a spin.
*   In a few months I will bump the version up to 1.0.0 to support [SemVer](http://semver.org/).
*   Please provide feedback or raise issues prior to the version bump.


## Quick Start

### Installation

Note: You will need to install [RethinkDB][rethinkdb-url] before you can use `rethinkdb-job-queue`

After installing [RethinkDB][rethinkdb-url] install the job queue using the following command.

```sh
npm install rethinkdb-job-queue --save
```

### Simple Example

```js

const Queue = require('rethinkdb-job-queue')
const qOptions = {
  name: 'Mathematics' // The queue and table name
}
const cxnOptions = {
  db: 'JobQueue', // The name of the database in RethinkDB
}

const q = new Queue(cxnOptions, qOptions)

const job = q.createJob()
job.numerator = 123
job.denominator = 456

return q.addJob(job).catch((err) => {
  console.error(err)
})

q.process((job, next) => {
    try {
      let result = job.numerator / job.denominator
      // Do something with your result
      return next(result)
    } catch (err) {
      console.error(err)
      return next(err)
    }
})

```

### E-Mail Job Example using [nodemailer][nodemailer-url]

```js

// The following is not related to rethinkdb-job-queue.
// This is the nodemailer configuration
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: 'postmaster@superheros.com',
    pass: 'your-api-key-here'
  }
})

// Setup e-mail data with unicode symbols
var mailOptions = {
  from: '"Registration" <support@superheros.com>', // Sender address
  subject: 'Registration', // Subject line
  text: 'Click here to complete your registration', // Plaintext body
  html: '<b>Click here to complete your registration</b>' // HTML body
}

// rethinkdb-job-queue configuration
const Queue = require('rethinkdb-job-queue')

// Queue options have defaults and are not required
const qOptions = {
  name: 'RegistrationEmail', // The queue and table name
  masterInterval: 310000, // Database review period in milliseconds
  changeFeed: true, // Enables events from the database table
  concurrency: 100,
  removeFinishedJobs: 2592000000, // true, false, or number of milliseconds
}

// Connection options have defaults and are not required
// You can replace these options with a rethinkdbdash driver object
const cxnOptions = {
  host: 'localhost',
  port: 28015,
  db: 'JobQueue', // The name of the database in RethinkDB
}

// This is the main queue instantiation call
const q = new Queue(cxnOptions, qOptions)

// Customizing the default job options for new jobs
q.jobOptions = {
  priority: 'normal',
  timeout: 300000,
  retryMax: 3, // Four attempts, first then three retries
  retryDelay: 600000 // Time in milliseconds to delay retries
}

const job = q.createJob()
// The createJob method will only create the job locally.
// It will need to be added to the queue.
// You can decorate the job with any data to be saved for processing
job.recipient = 'batman@batcave.com'

return q.addJob(job).then((savedJobs) => {
  // savedJobs is an array of the jobs added with updated properties
}).catch((err) => {
  console.error(err)
})

q.process((job, next) => {
  // Send email using job.recipient as the destination address
  mailOptions.to = job.recipient
  return transporter.sendMail(mailOptions).then((info) => {
    console.dir(info)
    return next(info)
  }).catch((err) => {
    // This catch if for nodemailer sendMail errors.
    return next(err)
  })
})

```

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Credits

Thanks to the following marvelous packages and people for their hard work:

-   The [RethinkDB][rethinkdb-url] team for the great database.
-   The RethinkDB driver [rethinkdbdash][rethinkdbdash-url] by [Michel][neumino-url]
-   The Promise library [Bluebird][bluebird-url] by [Petka Antonov][petka-url].
-   The [uuid][uuid-url] package.

This list could go on...

## License

MIT

[redis-url]: http://redis.io/
[kue-url]: http://automattic.github.io/kue/
[bull-url]: https://github.com/OptimalBits/bull
[bee-queue-url]: https://github.com/LewisJEllis/bee-queue
[rethinkdb-url]: http://www.rethinkdb.com/
[rethinkdbdash-url]: https://github.com/neumino/rethinkdbdash
[neumino-url]: https://github.com/neumino
[rjq-github-url]: https://github.com/grantcarthew/node-rethinkdb-job-queue
[rjq-wiki-url]: https://github.com/grantcarthew/node-rethinkdb-job-queue/wiki
[thinker-image]: https://cdn.rawgit.com/grantcarthew/node-rethinkdb-job-queue/master/thinkerjoblist.png
[nodemailer-url]: https://www.npmjs.com/package/nodemailer
[bluebird-url]: https://github.com/petkaantonov/bluebird
[petka-url]: https://github.com/petkaantonov
[uuid-url]: https://www.npmjs.com/package/uuid
[bithound-overall-image]: https://www.bithound.io/github/grantcarthew/node-rethinkdb-job-queue/badges/score.svg
[bithound-overall-url]: https://www.bithound.io/github/grantcarthew/node-rethinkdb-job-queue
[bithound-dep-image]: https://www.bithound.io/github/grantcarthew/node-rethinkdb-job-queue/badges/dependencies.svg
[bithound-dep-url]: https://www.bithound.io/github/grantcarthew/node-rethinkdb-job-queue/master/dependencies/npm
[bithound-code-image]: https://www.bithound.io/github/grantcarthew/node-rethinkdb-job-queue/badges/code.svg
[bithound-code-url]: https://www.bithound.io/github/grantcarthew/node-rethinkdb-job-queue
[js-standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[js-standard-url]: http://standardjs.com/
[nodei-npm-image]: https://nodei.co/npm/rethinkdb-job-queue.png?downloads=true&downloadRank=true&stars=true
[nodei-npm-url]: https://nodei.co/npm/rethinkdb-job-queue/
