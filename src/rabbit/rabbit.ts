import menash, { ConsumerMessage } from 'menashmq';
import config from '../config/env.config';
import { logInfo, logError } from '../logger/logger';
import { insertEntity } from '../service/entity/saveEntity';
import { createRgb } from '../service/rgb/rgbHandler';
import { entity } from '../types/entityType';
import { rgb } from '../types/rgbType';

export const connectRabbit = async () => {
  try {
    await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

    await menash.declareQueue(config.rabbit.getEntity);
    await menash.declareQueue(config.rabbit.getRGB);
    await menash.declareQueue(config.rabbit.connectDiToEntity);
    await menash.declareQueue(config.rabbit.logger);

    logInfo('Rabbit connected');

    await menash.queue(config.rabbit.getEntity).prefetch(250);
    await menash.queue(config.rabbit.getRGB).prefetch(250);

    await consumeGetEntity();
    await consumeGetRGB();
  } catch (error) {
    logError(JSON.stringify(error));
  }
};

async function consumeGetRGB() {
  await menash.queue(config.rabbit.getRGB).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const rgb = msg.getContent();
        logInfo(`Got from queue => `, rgb);

        await createRgb(rgb as rgb);
        logInfo('RGB insertion is done');

        msg.ack();
      } catch (error: any) {
        logError(error);

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
        logInfo(`Got from queue => `, entity);
        await insertEntity(entity);

        msg.ack();
      } catch (error: any) {
        logError(error.msg || error, error.identifier);

        msg.ack();
      }
    },
    { noAck: false }
  );
}

export default { connectRabbit };
