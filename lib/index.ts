import { createClient, RedisClient, ClientOpts, RedisError } from 'redis';

const defaultOptions = {
  host: '127.0.0.1',
  port: 6379,
  options: {}
};

export default class RedisDao {

  private options = {};
  private client: RedisClient;

  constructor (options) {
    if ( !options ) {
      throw new Error('redis config is missing');
    }
    for (let k in defaultOptions) {
      if ( typeof options[k] !== 'undefined' ) {
        this.options[k] = options[k];
      } else {
        this.options[k] = defaultOptions[k];
      }
    }
  }

  public connect (): RedisClient {
    if ( !this.client ) {
      this.client = createClient(this.options);
    }
    return this.client;
  }

  public getClient (): RedisClient {
    return this.client;
  }

  public async disconnect (): Promise<void> {
    if ( this.client ) {
      await this.client.end();
    }
  }
}
