import menash, { ConsumerMessage } from 'menashmq';
import config from '../config/env.config';
import { insertEntity } from '../service/entity/saveEntity';
import { createRgb } from '../service/rgb/rgbHandler';
import { entity } from '../types/entityType';
import { rgb } from '../types/rgbType';
import logger from 'logger-genesis';

export const connectRabbit = async () => {
  console.log('Trying to connect to RabbitMQ...');

  await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

  await menash.declareQueue(config.rabbit.getEntity);
  await menash.declareQueue(config.rabbit.getRGB);
  await menash.declareQueue(config.rabbit.logger);

  console.log('Rabbit connected');

  await consumeGetEntity();
  await consumeGetRGB();
};

async function consumeGetRGB() {
  await menash.queue(config.rabbit.getRGB).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const rgb = msg.getContent();
        logger.logInfo(true, 'Got from RGB queue', 'SYSTEM', JSON.stringify(rgb));

        await createRgb(rgb as rgb);
        logger.logInfo(true, 'RGB insertion is done', 'SYSTEM', '');

        msg.ack();
      } catch (error: any) {
        logger.logError(false, 'Unknown error', 'SYSTEM', error.message);

        msg.ack();
      }
    },
    { noAck: false }
  );
}

async function consumeGetEntity() {
  await menash.queue(config.rabbit.getEntity).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const entity = msg.getContent() as entity;
        logger.logInfo(true, 'Got from ENTITY queue', 'SYSTEM', JSON.stringify(entity));
        await insertEntity(entity);
        logger.logInfo(true, 'entity insertion is done', 'SYSTEM', '');

        msg.ack();
      } catch (error: any) {
        logger.logError(false, 'Unknown error', 'SYSTEM', error.message);

        msg.ack();
      }
    },
    { noAck: false }
  );
}

export default { connectRabbit };
