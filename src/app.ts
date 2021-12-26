import { initializeLogger } from './logger/logger';
import { connectRabbit, initializeConsumers } from './rabbit/rabbit';
import { RecoveryDiConnection } from './redis/DailyRecovery';
import redisClient from './redis/redis';

const start = async () => {
  redisClient(async () => {
    await connectRabbit();
    await initializeLogger();
    await initializeConsumers();
    RecoveryDiConnection.getInstance().start();
  });
};

start().catch((e) => console.log(e));
