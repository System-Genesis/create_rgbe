import { connectRabbit } from './rabbit/rabbit';
import redisClient from './redis/redis';

const start = () => {
  redisClient(connectRabbit);
};

start();
