import { configure, getLogger } from 'log4js'

// TODO: advance log level config
export enum LogLevel {
  all = 'ALL',
  trace = 'TRACE',
  debug = 'DEBUG',
  info = 'INFO',
  warn = 'WARN',
  error = 'ERROR',
  FATAL = 'FATAL',
  mark = 'MARK',
  off = 'OFF'
}

let configObj = {
  appenders: {
    out: {
      type: 'stdout'
    },
    // file: {
    //   type: 'file',
    //   filename: 'log.log'
    // }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: LogLevel.off
    },
    engine: {
      appenders: ['out'],
      level: LogLevel.off
    },
    job: {
      appenders: ['out'],
      level: LogLevel.off
    },
    fetcher: {
      appenders: ['out'],
      level: LogLevel.off
    },
    downloader: {
      appenders: ['out'],
      level: LogLevel.off
    },
    store: {
      appenders: ['out'],
      level: LogLevel.off
    }
  }
}
// config logger config
configure(configObj)
export function switchLog(isLog: boolean) {
  let logLevel = isLog ? LogLevel.all : LogLevel.off
  for (const category in configObj.categories) {
    configObj.categories[category].level = logLevel
  }
  configure(configObj)
}
export default  getLogger()
export const engine = getLogger('engine')
export const job = getLogger('job')
export const fetcher = getLogger('fetcher')
export const downloader = getLogger('downloader')
export const store = getLogger('store')
