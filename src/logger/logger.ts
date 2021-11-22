import configEnv from '../config/env.config';
import logger from 'logger-genesis';

export const initializeLogger = async () => {
  const rabbitEnv = configEnv.rabbit;
  await logger.initialize(
    configEnv.systemName,
    configEnv.serviceName,
    rabbitEnv.uri,
    rabbitEnv.logger,
    true,
    rabbitEnv.retryOptions
  );
};
