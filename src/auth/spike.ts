import getTokenCreator from 'spike-token-manager';
import config from '../config/env.config';
import path from 'path';

const { spike, redisUrl } = config;

const options = {
  redisHost: redisUrl,
  clientId: spike.clientId,
  clientSecret: spike.clientSecret,
  spikeURL: spike.spikeUrl,
  tokenGrantType: 'client_credentials',
  tokenAudience: spike.kartofelAud,
  tokenRedisKeyName: spike.redisKeyName,
  spikePublicKeyFullPath: path.join(__dirname, '../key/key.pem'),
  useRedis: true,
  httpsValidation: false,
};

export const token = getTokenCreator(options);

const getToken = async () => ({
  headers: { Authorization: await token() },
});

export default getToken;
