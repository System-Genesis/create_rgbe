import './dotenv';

import * as env from 'env-var';

export default {
  serviceName: env.get('SERVICE_NAME').required().asString(),
  systemName: env.get('SYSTEM_NAME').required().asString(),
  rabbit: {
    uri: env.get('RABBIT_URI').required().asString(),
    logger: env.get('LOGGER_QUEUE').required().asString(),
    getEntity: env.get('GET_ENTITY_QUEUE').required().asString(),
    getRGB: env.get('GET_RGB_QUEUE').required().asString(),
    getMir: env.get('MIR_QUEUE').required().asString(),
    prefetch: env.get('PREFETCH').required().default(100).asIntPositive(),
    retryOptions: {
      minTimeout: env.get('RABBIT_RETRY_MIN_TIMEOUT').default(1000).asIntPositive(),
      retries: env.get('RABBIT_RETRY_RETRIES').default(10).asIntPositive(),
      factor: env.get('RABBIT_RETRY_FACTOR').default(1.8).asFloatPositive(),
    },
  },
  krtflApi: env.get('KRTFL_API').required().asString(),
  redisUrl: env.get('REDIS_URL').required().asString(),
  isSpike: env.get('IS_SPIKE').asBool(),
  spike: {
    spikeUrl: env.get('SPIKE_URL').required().asString(),
    redisKeyName: env.get('REDIS_KEY_NAME').required().asString(),
    myAud: env.get('MY_AUDIENCE').required().asString(),
    clientId: env.get('MY_CLIENT_ID').required().asString(),
    clientSecret: env.get('MY_CLIENT_SECRET').required().asString(),
    kartofelAud: env.get('KARTOFEL_AUDIENCE').required().asString(),
  },
  daily: {
    hour: env.get('HOUR').required().asInt(),
    minute: env.get('MINUTE').required().asInt(),
  },
  redisRecovery: env.get('REDIS_RECOVERY').default('true').asBool(),
};
