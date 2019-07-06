import { RedisClient } from 'redis'

export default interface RedisDao {
  connect (): RedisClient
  getClient (): RedisClient
  disconnect (): Promise<void>

  set (key: string | number, val: string): Promise<boolean>
  get (key: string | number, decoder?: Function): Promise<string | Buffer>
  expire (key: string | number, seconds: number): Promise<boolean>
  del (...key: (string|number)[]): Promise<boolean>
  sendCommand (cmd: string, ...args): Promise<any>
}
