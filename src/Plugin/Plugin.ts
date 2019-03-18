import md5 = require('blueimp-md5')
import Store from '../Store/Store'

export default abstract class Plugin{
  public store: Store // Plugin store
  public abstract PluginName: string // plugin name
   public abstract majorVer: string // plugin major version, store files name is md5(name, majorVer)
  public abstract minorVer: string //  plugin minor version
  public ID: string

  /**
   * wrap function for engine, NOT CALL
   */
  public _apply(hooks: Hooks) {
    this.setID()
    this.initStore()
    this.apply(hooks)
  }
  /**
   * register hook for engine run
   */
  public abstract apply(hooks: Hooks): void
  /**
   * set plugin id
   */
  private setID() {
    this.ID = md5(this.PluginName, this.majorVer)
  }
  /**
   * init store
   */
  private initStore() {
    this.store = new Store(this.ID)
  }
}
