import { connectRabbit } from './rabbit/rabbit';
import { DailyRun } from './redis/DailyRun';
import redisClient from './redis/redis';

const start = () => {
  redisClient(async () => {
    await connectRabbit();
    DailyRun.getInstance().start();
  });
};

start();
