import { RedisClient } from 'redis'
import RedisDao from './dao'

export default class RedisRepository<T> {

  protected entityClz: Function

  constructor (entity: Function)

  getDao(master?: boolean): RedisDao
  getClient (): RedisClient

  set (key: string, val: string): Promise<boolean>
  get (key: string): Promise<string | Buffer>
  expire (key: string, seconds: number): Promise<boolean>
  del (...key: string[]): Promise<boolean>
  sendCommand (cmd: string, ...args): Promise<any>
}
