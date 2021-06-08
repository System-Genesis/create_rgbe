import './dotenv';

import * as env from 'env-var';

export default {
  rabbit: {
    uri: env.get('RABBIT_URI').required().asString(),
    logger: env.get('LOGGER').required().asString(),
    getEntity: env.get('GET_DATA').required().asString(),
    getRGB: env.get('GET_RGB').required().asString(),
    retryOptions: {
      minTimeout: env.get('RABBIT_RETRY_MIN_TIMEOUT').default(1000).asIntPositive(),
      retries: env.get('RABBIT_RETRY_RETRIES').default(2).asIntPositive(),
      factor: env.get('RABBIT_RETRY_FACTOR').default(1.8).asFloatPositive(),
    },
  },
  krtflApi: env.get('KRTFL_API').required().asString(),
};
