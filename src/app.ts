import { connectRabbit } from "./rabbit/rabbit";
import { RecoveryDiConnection } from "./redis/DailyRecovery";
import redisClient from "./redis/redis";

const start = async () => {
  redisClient(async () => {
    await connectRabbit();
    RecoveryDiConnection.getInstance().start();
  });
};

start().catch((e) => console.log(e));
