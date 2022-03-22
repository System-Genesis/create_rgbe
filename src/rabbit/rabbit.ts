import logger from 'logger-genesis';
import menash, { ConsumerMessage } from 'menashmq';
import config from '../config/env.config';
import { deleteDIAndRole } from '../service/delete/handleDelete';
import { insertEntity } from '../service/entity/saveEntity';
import { mirHandler } from '../service/rgb/mirHandler';
import { createRgb } from '../service/rgb/rgbHandler';
import { entity } from '../types/entityType';
import { rgb, rgbMir } from '../types/rgbType';

export const connectRabbit = async () => {
  try {
    console.log('Try connect to Rabbit');

    await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

    await menash.declareQueue(config.rabbit.getEntity, { durable: true });
    await menash.declareQueue(config.rabbit.getRGB, { durable: true });
    await menash.declareQueue(config.rabbit.getMir, { durable: true });
    await menash.declareQueue(config.rabbit.getDelete, { durable: true });

    console.log('Rabbit connected');

    await menash.queue(config.rabbit.getEntity).prefetch(config.rabbit.prefetch);
    await menash.queue(config.rabbit.getRGB).prefetch(config.rabbit.prefetch);
    await menash.queue(config.rabbit.getMir).prefetch(config.rabbit.prefetch);
    await menash.queue(config.rabbit.getDelete).prefetch(config.rabbit.prefetch);
  } catch (error: any) {
    console.log('Unknown Error, on Connect Rabbit', error.message);
  }
};

export const initializeConsumers = async () => {
  await consumeGetEntity();
  await consumeGetRGB();
  await consumeGetMir();
  await consumeDeleteDIAndRole();
};

/**
 * Create/update digital identity & group & role simple flow
 */
async function consumeGetRGB() {
  await menash.queue(config.rabbit.getRGB).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const rgb = msg.getContent();
        logger.info(false, 'APP', 'Got from RGB queue', JSON.stringify(rgb));

        await createRgb(rgb as rgb);
        logger.info(false, 'APP', 'RGB insertion is done', '');

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

/**
 * Handle source that can be created only if kartoffel already have the related entity
 */
async function consumeGetMir() {
  await menash.queue(config.rabbit.getMir).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const rgb = msg.getContent();
        logger.info(false, 'APP', 'Got from MIR queue', JSON.stringify(rgb));

        await mirHandler(rgb as rgbMir);
        logger.info(false, 'APP', 'MIR insertion is done', '');

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

/**
 * Create/update entity
 */
async function consumeGetEntity() {
  await menash.queue(config.rabbit.getEntity).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const entity = msg.getContent() as entity;
        logger.info(false, 'APP', 'Got from ENTITY queue', JSON.stringify(entity));

        await insertEntity(entity);
        logger.info(false, 'APP', 'ENTITY insertion is done', '');

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

async function consumeDeleteDIAndRole() {
  await menash.queue(config.rabbit.getDelete).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const uniqueId: string = msg.getContent() as string;
        logger.info(false, 'APP', 'Got uniqueId to delete', JSON.stringify(uniqueId));

        await deleteDIAndRole(uniqueId);
        logger.info(false, 'APP', 'DI and Role delete done', '');

        msg.ack();
      } catch (error: any) {
        const erMsg = JSON.stringify(error.message);
        console.log(`error DELETE Queue: ${erMsg}`);

        msg.ack();
      }
    },
    { noAck: false }
  );
}

export default { connectRabbit };
