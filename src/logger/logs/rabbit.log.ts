import logger from 'logger-genesis';

const GOT_FROM_QUEUE = (queueName: string, data: any) => {
  logger.info(false, 'APP', `Got from ${queueName} queue`, JSON.stringify(data));
};

const QUEUE_FLOW_DONE = (queueName: string) => {
  logger.info(false, 'APP', `${queueName} queue insertion is done`, '');
};

export default {
  GOT_FROM_QUEUE,
  QUEUE_FLOW_DONE,
};
