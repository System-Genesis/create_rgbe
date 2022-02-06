import { rgbMir } from './../../types/rgbType';
import { rgb } from '../../types/rgbType';
import { createRgb } from './rgbHandler';
import { entityApi } from './../../api/entity';
import logger from 'logger-genesis';

export const checkEntityExists = async (entityIdentifier: string | undefined) => {
  if (!entityIdentifier) return null;

  return (await entityApi.get(entityIdentifier)) ? entityIdentifier : null;
};

export const mirHandler = async (rgb: rgbMir) => {
  const identifiers = rgb.identifiers;
  if (identifiers) {
    const entityIdentifier =
      (await checkEntityExists(identifiers.goalUserId)) ||
      (await checkEntityExists(identifiers.identityCard)) ||
      (await checkEntityExists(identifiers.personalNumber));

    if (entityIdentifier) {
      const msg = `di.uniqueId: ${rgb.di.uniqueId} to entity identifiers: ${rgb.di.entityId}`;
      logger.info(true, 'APP', 'Mir has entity to connect', msg);

      rgb.di.entityId = entityIdentifier;
      await createRgb(rgb as rgb);
    } else {
      logger.warn(false, 'APP', 'Mir does not have entity to connect', `di:${rgb.di.uniqueId}`, {
        di: rgb.di.uniqueId,
      });
    }
  } else {
    logger.error(true, 'APP', 'Mir object without any identifiers', `di:${rgb.di.uniqueId}`, { di: rgb.di.uniqueId });
  }
};