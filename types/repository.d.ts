import { RedisClient } from 'redis'
import RedisDao from './dao'

export default class RedisRepository<T> {

  protected entityClz: Function

  constructor (entity: Function)

  getDao(master?: boolean): RedisDao
  getClient (): RedisClient

  set (key: string | number, val: string): Promise<boolean>
  get (key: string | number, decoder?: Function): Promise<string | Buffer>
  expire (key: string | number, seconds: number): Promise<boolean>
  del (...key: (string|number)[]): Promise<boolean>
  sendCommand (cmd: string, ...args): Promise<any>
}
