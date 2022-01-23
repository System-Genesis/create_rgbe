import { rgbMir } from './../../types/rgbType';
import { rgb } from '../../types/rgbType';
import { createRgb } from './rgbHandler';
import { entityApi } from './../../api/entity';
import logger from 'logger-genesis';

const checkEntityExists = async (entityIdentifier: string | undefined) => {
  if (!entityIdentifier) {
    return null;
  }

  await entityApi.get(entityIdentifier);
  return entityIdentifier;
};

export const mirHandler = async (rgb: rgbMir) => {
  const identifier = rgb.identifier;
  if (identifier) {
    const entityIdentifier =
      (await checkEntityExists(identifier.goalUserId)) ||
      (await checkEntityExists(identifier.identityCard)) ||
      (await checkEntityExists(identifier.personalNumber));

    if (entityIdentifier) {
      const msg = `di.uniqueId: ${rgb.di.uniqueId} to entity identifier: ${rgb.di.entityId}`;
      logger.info(true, 'APP', 'Mir has entity to connect', msg);

      rgb.di.entityId = entityIdentifier;
      await createRgb(rgb as rgb);
    } else {
      logger.warn(false, 'APP', 'Mir does not have entity to connect', `di:${rgb.di.uniqueId}`, {
        di: rgb.di.uniqueId,
      });
    }
  } else {
    logger.error(true, 'APP', 'Mir object without any identifier', `di:${rgb.di.uniqueId}`, { di: rgb.di.uniqueId });
  }
};
