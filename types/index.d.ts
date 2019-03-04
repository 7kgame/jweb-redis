import { RedisClient } from 'redis';

export default interface RedisDao {
  connect (): RedisClient;
  getClient (): RedisClient;
  disconnect (): Promise<void>;
}
