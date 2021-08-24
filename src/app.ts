import { connectRabbit } from './rabbit/rabbit';
import { RecoveryDiConnection } from './redis/DailyRecovery';
import redisClient from './redis/redis';

const start = () => {
  redisClient(async () => {
    await connectRabbit();
    RecoveryDiConnection.getInstance().start();
  });
};

start();
