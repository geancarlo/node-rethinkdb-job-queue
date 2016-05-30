module.exports = {
  priorities: {
    lowest: 60,
    low: 50,
    normal: 40,
    medium: 30,
    high: 20,
    highest: 10,
    retry: 1 // Used for retries after a job has stalled or failed.
  },
  statuses: {
    created: 'created',
    delayed: 'delayed',
    active: 'active',
    waiting: 'waiting',
    completed: 'completed',
    failed: 'failed',
    retry: 'retry'
  },
  indexes: {
    priority_dateCreated: 'priority_dateCreated',
    inactive: 'inactive_priority_dateCreated',
    stalled: 'stalled',
    status: 'status',
    active: 'active'
  },
  log: {
    type: {
      information: 'information',
      started: 'started',
      completed: 'completed',
      warning: 'warning',
      error: 'error'
    }
  }
}