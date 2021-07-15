import getTokenCreator from 'spike-get-token';
import config from '../config/env.config';
import path from 'path';
import process from 'process';

const { spike } = config;

const options = {
  redisHost: spike.redisUrl,
  clientId: spike.clientId,
  clientSecret: spike.clientSecret,
  spikeURL: spike.spikeUrl,
  tokenGrantType: 'client_credentials',
  tokenAudience: spike.kartofelAud,
  tokenRedisKeyName: spike.redisKeyName,
  spikePublicKeyFullPath: path.join(process.cwd(), './key.pem'),
  useRedis: true,
  httpsValidation: false,
};

const getToken = () => ({
  headers: { Authorization: getTokenCreator(options) },
});

export default getToken;
