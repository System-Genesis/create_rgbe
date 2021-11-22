import logger from 'logger-genesis';
import menash, { ConsumerMessage } from 'menashmq';
import config from '../config/env.config';
import { insertEntity } from '../service/entity/saveEntity';
import { createRgb } from '../service/rgb/rgbHandler';
import { entity } from '../types/entityType';
import { rgb } from '../types/rgbType';

export const connectRabbit = async () => {
  try {
    console.log('Try connect to Rabbit');

    await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

    await menash.declareQueue(config.rabbit.getEntity);
    await menash.declareQueue(config.rabbit.getRGB);

    console.log('Rabbit connected');

    await menash.queue(config.rabbit.getEntity).prefetch(config.rabbit.prefetch);
    await menash.queue(config.rabbit.getRGB).prefetch(config.rabbit.prefetch);

    await consumeGetEntity();
    await consumeGetRGB();
    console.log('menash.isReady ' + menash.isReady);
  } catch (error: any) {
    logger.logError(true, 'Unknown Error, on Connect Rabbit', 'APP', error.message);
  }
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
        const erMsg = JSON.stringify(error.message);
        logger.logError(false, 'Unknown Error', 'APP', `RGB Queue: ${erMsg}`);

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
        logger.logInfo(true, 'ENTITY insertion is done', 'SYSTEM', '');

        msg.ack();
      } catch (error: any) {
        const erMsg = JSON.stringify(error.message);
        logger.logError(false, 'Unknown Error', 'APP', `ENTITY Queue: ${erMsg}`);

        msg.ack();
      }
    },
    { noAck: false }
  );
}

export default { connectRabbit };
