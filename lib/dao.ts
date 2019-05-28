import { createClient, RedisClient, ClientOpts, RedisError } from 'redis'

const defaultOptions = {
  host: '127.0.0.1',
  port: 6379,
  path: null,
  url: null,
  parser: 'javascript',
  string_numbers: null,
  return_buffers: false,
  detect_buffers: false,
  socket_keepalive: true,
  socket_initialdelay: 0,
  no_ready_check: false,
  enable_offline_queue: false
}

export default class RedisDao {

  private options = {}
  private client: RedisClient

  constructor (options) {
    if ( !options ) {
      throw new Error('redis config is missing')
    }
    Object.assign(this.options, defaultOptions)
    for (let k in options) {
      if (typeof this.options[k] !== 'undefined') {
        this.options[k] = options[k]
      }
    }
  }

  public connect (): RedisClient {
    if ( !this.client ) {
      this.client = createClient(this.options)
    }
    return this.client
  }

  public getClient (): RedisClient {
    return this.client
  }

  public async disconnect (): Promise<void> {
    if ( this.client ) {
      await this.client.end()
    }
  }

  public set (key: string, val: string): Promise<boolean> {
    return this.sendCommand('set', key, val)
  }

  public get (key: string): Promise<string | Buffer> {
    return this.sendCommand('get', key)
  }

  public expire (key: string, seconds: number): Promise<boolean> {
    return this.sendCommand('expire', key, seconds)
  }

  public del (...key: string[]): Promise<boolean> {
    return this.sendCommand.call(this, 'del', ...key)
  }

  public sendCommand (cmd: string, ...args): Promise<any> {
    return new Promise((res, rej) => {
      const client: RedisClient = this.getClient()
      if (!client) {
        rej('redis client is empty')
        return
      }
      client.sendCommand(cmd, args, function (err, data) {
        if (err) {
          rej(err)
        } else {
          res(data)
        }
      })
    })
  }

}
