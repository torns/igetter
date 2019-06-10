import Job from './Job'

interface jobInfo {
  job: Job,
  lastRun: number
}

// TODO: job priority
// TODO: job done time analyze
export default class JobPool{
  public waitMaxCount = 20
  private waitJobs: Job[] = [] // waiting job
  private allJobs: Map<string, jobInfo> = new Map()
  public constructor() {
    this.schedule()
  }
  /**
   * get appoint amount waiting Job
   */
  public getWaitJobs(amount: number) {
    let jobs =  this.waitJobs.splice(0, amount)
    this.schedule()
    return jobs
  }
  /**
   * add job to allJobs
   */
  public addJob(job: Job) {
    let id = job.id
    let jobInfo: jobInfo = {
      job,
      lastRun: -Infinity
    }
    this.allJobs.set(id, jobInfo)
  }
  /**
   * set job last run time
   */
  public setLastrun(id: string) {
    let jobInfo = this.allJobs.get(id)
    jobInfo.lastRun = Date.now()
  }
  /**
   * generate waitJob from allJobs
   */
  private schedule() {
    if (this.allJobs.size !== 0 && this.waitJobs.length < this.waitMaxCount) {
      this.allJobs.forEach(async (jobInfo) => {
        let { job, lastRun} = jobInfo
        if (job.isActive || this.waitJobs.includes(job)) {
          return
        }
        let interval = Date.now() - lastRun
        interval /= 1000
        if (interval > job.minInterval) {
          this.waitJobs.push(job)
        }
      })
    }
  }
}
