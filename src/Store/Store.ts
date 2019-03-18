import * as DataStore from 'nedb'
import { promisify } from 'util'
import { store as logger } from '../utils/logger'

// TODO: 分离Store
/**
 * convert 'await promise' result to [error, data] style
 */
async function to(p: Promise<any>) {
  return p.then(data => [null, data]).catch(err => [err, null])
}

/**
 * util function, convert CPS style to async/await style
 */
function wrap(fn: Function) {
  return async (...args) => {
    let p = promisify(fn)(...args)
    let [err, res] = await to(p)
    if (err) {
      logger.error(err)
      return err
    }
    return res
  }
}

export default class Store {
  private db: DataStore // NeDB instance
  private path: string // store file path
  private id: string // Job id
  public constructor(id: string) {
    this.id = id
    let path = `./data/${id}.json`
    this.path = path
    this.db = new DataStore({
      filename: this.path,
      autoload: true
    })
  }
  /**
   * release store instance
   */
  public disconnect() {
    delete this.db
    logger.debug(`[job] ID: ${this} disconnected Store.`)
  }
  /**
   * insert doc like mongoDB
   */
  public async insert(doc: any) {
    let res = wrap(this.db.insert.bind(this.db))(doc)
    logger.debug(`[job] ID: ${this} Store insert ${doc}`)
    return res
  }
  /**
   * find doc like mongoDB
   */
  public async find(query: any) {
    return wrap(this.db.find.bind(this.db))(query)
  }
  /**
   * find doc, return one result
   */
  public async findOne(query: any) {
    return wrap(this.db.findOne.bind(this.db))(query)
  }
  /**
   * count query
   */
  public async count(query: any) {
    return wrap(this.db.count.bind(this.db))(query)
  }
  /**
   * update doc
   */
  public async update(query: any, update: any, options?: DataStore.UpdateOptions) { // 更新
    let res = wrap(this.db.update.bind(this.db))(query, update, options)
    logger.debug(`[job] ID: ${this} update ${res}`)
    return res
  }
  /**
   * remove doc
   */
  public async remove(query: any, options?: DataStore.RemoveOptions) { // 删除
    let res = wrap(this.db.remove.bind(this.db))(query, options)
    logger.debug(`[job] ID: ${this} remove ${res}`)
    return res
  }
  /**
   * get last store doc
   */
  public async getLast() {
    return await this.findOne({_isLast: true})
  }
  /**
   * set latest store doc
   */
  public async setLast(doc: any) {
    debugger
    let lastID = await this.getLast() || null
    if (lastID !== null) {
      lastID = lastID._id
    } else {
      lastID = null
    }
    await this.update({_isLast: true}, { $set: {_isLast: false}}, {})
    doc.prev = lastID
    doc._isLast = true
    await this.insert(doc)
    logger.debug(`[job] ID: ${this} Store setLast.`)
  }
  /**
   * get all docs
   */
  public async getAll() {
    return await this.find({})
  }
  public getDB() {
    return this.db
  }
}
