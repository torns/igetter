import Store from './Store'

// TODO: 异步存储
export default class Stores{
  private Stores: Map<string, Store>
  private counts = 10
  public constructor() {
    this.Stores = new Map()
  }
  public save(id: string, data: any) {
    let store = this.getStore(id)
    store.insert(data).then(() => {
      console.log('asds')
    })
  }
  public getStore(id: string) {
    let store = this.Stores.get(id)
    debugger
    if (!store) {
      store = new Store(id)
      this.Stores.set(id, store)
      this.cleanStore()
    }
    return store
  }
  public  async getLast(id: string) {
    let store = this.getStore(id)
    return await store.getLast()
  }
  public  async setLast(id: string, data: any) {
    debugger
    let store = this.getStore(id)
    await store.setLast(data)
  }
  public  cleanStore() {
    if (this.Stores.size > this.counts) {
      let key = this.Stores.keys().next().value
      this.Stores.delete(key)
    }
  }
}
