import logger from 'logger-genesis';
import menash, { ConsumerMessage } from 'menashmq';
import config from '../config/env.config';
import { insertEntity } from '../service/entity/saveEntity';
import { mirHandler } from '../service/rgb/mirHandler';
import { createRgb } from '../service/rgb/rgbHandler';
import { entity } from '../types/entityType';
import { rgb } from '../types/rgbType';

export const connectRabbit = async () => {
  try {
    console.log('Try connect to Rabbit');

    await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

    await menash.declareQueue(config.rabbit.getEntity);
    await menash.declareQueue(config.rabbit.getRGB);
    await menash.declareQueue(config.rabbit.getMir);

    console.log('Rabbit connected');

    await menash.queue(config.rabbit.getEntity).prefetch(config.rabbit.prefetch);
    await menash.queue(config.rabbit.getRGB).prefetch(config.rabbit.prefetch);
    await menash.queue(config.rabbit.getMir).prefetch(config.rabbit.prefetch);
  } catch (error: any) {
    console.log('Unknown Error, on Connect Rabbit', error.message);
  }
};

export const initializeConsumers = async () => {
  await consumeGetEntity();
  await consumeGetRGB();
  await consumeGetMir();
};

async function consumeGetRGB() {
  await menash.queue(config.rabbit.getRGB).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const rgb = msg.getContent();
        logger.info(true, 'APP', 'Got from RGB queue', JSON.stringify(rgb));

        await createRgb(rgb as rgb);
        logger.info(true, 'APP', 'RGB insertion is done', '');

        msg.ack();
      } catch (error: any) {
        const erMsg = JSON.stringify(error.message);
        console.log(`error RGB Queue: ${erMsg}`);

        msg.ack();
      }
    },
    { noAck: false }
  );
}

async function consumeGetMir() {
  await menash.queue(config.rabbit.getMir).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const rgb = msg.getContent();
        logger.info(true, 'APP', 'Got from MIR queue', JSON.stringify(rgb));

        await mirHandler(rgb as rgb);
        logger.info(true, 'APP', 'MIR insertion is done', '');

        msg.ack();
      } catch (error: any) {
        const erMsg = JSON.stringify(error.message);
        console.log(`error MIR Queue: ${erMsg}`);

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
        logger.info(true, 'APP', 'Got from ENTITY queue', JSON.stringify(entity));

        await insertEntity(entity);
        logger.info(true, 'APP', 'ENTITY insertion is done', '');

        msg.ack();
      } catch (error: any) {
        const erMsg = JSON.stringify(error.message);
        console.log(`error ENTITY Queue: ${erMsg}`);

        msg.ack();
      }
    },
    { noAck: false }
  );
}

export default { connectRabbit };
