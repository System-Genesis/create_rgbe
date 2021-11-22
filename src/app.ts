import { initializeLogger } from './logger/logger';
import { connectRabbit } from './rabbit/rabbit';
import { RecoveryDiConnection } from './redis/DailyRecovery';
import redisClient from './redis/redis';

const start = () => {
  redisClient(async () => {
    await connectRabbit();
    await initializeLogger();
    RecoveryDiConnection.getInstance().start();
  });
};

start();
