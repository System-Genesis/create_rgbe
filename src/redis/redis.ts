import redis from 'redis';
import { promisify } from 'util';
import envConfig from '../config/env.config';

export let delValue: (key: string) => Promise<boolean>;
export let pushToArray: (key: string, value: string) => Promise<boolean>;
export let getArray: (key: string) => Promise<string[]>;
export let getAllKeys: () => Promise<string[]>;

const redisClient = (cb?: any) => {
  const client = redis.createClient(envConfig.redisUrl);

  client.on('connect', () => {
    console.log('Redis connected (di to entity)');
    cb();
  });

  client.on('error', (err) => {
    console.error('Redis Error: ' + err);
  });

  delValue = async (key: string) => client.del(`DI_TO_ENTITY^${key}`);
  pushToArray = async (key: string, value: string) => client.lpush(`DI_TO_ENTITY^${key}`, value);
  getArray = async (key: string) => {
    return promisify(client.lrange).bind(client)(`DI_TO_ENTITY^${key}`, 0, -1);
  };
  getAllKeys = async () => {
    const keys = await promisify(client.keys).bind(client)(`DI_TO_ENTITY^*`);
    let normalizeKeys: string[] = [];

    for (let i = 0; i < keys.length; i++) {
      normalizeKeys.push(keys[i].split('^')[1]);
    }

    return normalizeKeys;
  };
};

export default redisClient;
