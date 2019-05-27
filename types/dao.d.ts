import { RedisClient } from 'redis'

export default interface RedisDao {
  connect (): RedisClient
  getClient (): RedisClient
  disconnect (): Promise<void>

  set (key: string, val: string): Promise<boolean>
  get (key: string): Promise<string | Buffer>
  expire (key: string, seconds: number): Promise<boolean>
  del (...key: string[]): Promise<boolean>
  sendCommand (cmd: string, ...args): Promise<any>
}
