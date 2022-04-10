import menash from 'menashmq';
import logger from 'logger-genesis';
import { client } from '../redis/redis';

export default () => {
  return menash.isReady && logger.isConnected() && client.connected;
};
