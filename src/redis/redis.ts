import redis from 'redis';
import { promisify } from 'util';
import envConfig from '../config/env.config';

export let setValue: (key: string, value: string) => Promise<boolean>;
export let getValue: (key: string) => Promise<string | null>;
export let delValue: (key: string) => Promise<boolean>;

const redisClient = (cb?: any) => {
  const client = redis.createClient(envConfig.spike.redisUrl);
  const getAsync = promisify(client.get).bind(client);

  client.on('connect', () => {
    console.log('Redis connected (di to entity)');
    cb();
  });

  client.on('error', (err) => {
    console.error('Redis Error: ' + err);
  });

  getValue = async (key: string) => await getAsync(key);
  setValue = async (key: string, value: string) => client.set(key, value);
  delValue = async (key: string) => client.del(key);
};

export default redisClient;
