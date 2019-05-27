import { BeanFactory, CTOR_JWEB_PACKAGE_KEY, Page } from 'jbean'
import RedisDao from './dao'
import { RedisClient } from 'redis'

const BEAN_PREFIX = 'redis.'
const DEFAULT_DAO_BEAN = 'primary'

export default class RedisRepository<T> {

  protected entityClz: Function
  private useDefaultDao: boolean = false

  public constructor (entityClz: Function) {
    this.entityClz = entityClz
  }

  public getDao(master?: boolean): RedisDao {
    master = master || false
    const filter = function (target: any) {
      if (!target || !target.ins || typeof target.ins.isMaster !== 'function') {
        return false
      }
      return target.ins.isMaster() === master
    }
    let bean: RedisDao = null
    if (!this.useDefaultDao) {
      const jwebPackage: string = this.constructor && this.constructor[CTOR_JWEB_PACKAGE_KEY]
      bean = <RedisDao> BeanFactory.getBeanByPackage(jwebPackage, filter, BEAN_PREFIX)
    }

    if (!bean) {
      this.useDefaultDao = true
      bean = <RedisDao> BeanFactory.getBean(BEAN_PREFIX + DEFAULT_DAO_BEAN)
    }
    return bean
  }

  public set (key: string, val: string): Promise<boolean> {
    return this.getDao(true).sendCommand('set', key, val)
  }

  public get (key: string): Promise<string | Buffer> {
    return this.getDao().sendCommand('get', key)
  }

  public expire (key: string, seconds: number): Promise<boolean> {
    return this.getDao(true).sendCommand('expire', key, seconds)
  }

  public del (...key: string[]): Promise<boolean> {
    return this.getDao(true).sendCommand.call(this, 'del', ...key)
  }

  public sendCommand (cmd: string, ...args): Promise<any> {
    let master = false
    if (args && args.length > 0) {
      if (typeof args.slice(-1)[0] === 'boolean') {
        master = args.pop()
      }
    }
    const dao = this.getDao(master)
    return dao.sendCommand.call(dao, cmd, ...args)
  }

  public getClient (master?: boolean): RedisClient {
    return this.getDao(master).getClient()
  }

}