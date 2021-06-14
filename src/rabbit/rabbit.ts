import menash, { ConsumerMessage } from 'menashmq';
import config from '../config/env.config';
import { logInfo, logError } from '../logger/logger';
import { insertEntity } from '../service/entity/saveEntity';
import { connectDiToEntity } from '../service/diToEntity/connectDiToEntity';
import { createRgb } from '../service/rgb/rgbHandler';
import { entity } from '../types/entityType';
import { rgb } from '../types/rgbType';

export const connectRabbit = async () => {
  await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

  await menash.declareQueue(config.rabbit.getEntity);
  await menash.declareQueue(config.rabbit.getRGB);
  await menash.declareQueue(config.rabbit.connectDiToEntity);
  await menash.declareQueue(config.rabbit.logger);

  logInfo('Rabbit connected');

  await menash.queue(config.rabbit.connectDiToEntity).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const { entityId, diId } = msg.getContent() as { entityId: string; diId: string };
        logInfo(`Try to connect entity: ${entityId} to di: ${diId}`, { entityId, diId });
        await connectDiToEntity(entityId, diId);

        logInfo(`Success to connect entity: ${entityId} to di: ${diId}`, { entityId, diId });
        msg.ack();
      } catch (error) {
        logError(error);

        // handle error reject or else ...
        msg.ack();
      }
    },
    { noAck: false }
  );

  await menash.queue(config.rabbit.getEntity).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const entity = msg.getContent() as entity;
        logInfo(`Got from queue => `, entity);
        await insertEntity(entity);

        logInfo('Entity insertion is done');
        msg.ack();
      } catch (error) {
        logError(error);

        // handle error reject or else ...
        msg.ack();
      }
    },
    { noAck: false }
  );

  await menash.queue(config.rabbit.getRGB).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const rgb = msg.getContent();
        logInfo(`Got from queue => `, rgb);

        await createRgb(rgb as rgb);
        logInfo('RGB insertion is done');

        msg.ack();
      } catch (error) {
        logError(error);

        // handle error reject or else ...
        msg.ack();
      }
    },
    { noAck: false }
  );
};

export default { connectRabbit };
