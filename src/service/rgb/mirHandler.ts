import { rgb } from '../../types/rgbType';
import { createRgb } from './rgbHandler';
import { entityApi } from './../../api/entity';
import logger from 'logger-genesis';

const checkEntityExists = async (entityIdentifier: string | undefined) => {
  if (!entityIdentifier) {
    return null;
  }

  const entity = await entityApi.get(entityIdentifier);
  return entity;
};

export const mirHandler = async (rgb: rgb) => {
  const entity = await checkEntityExists(rgb.di.entityId);

  if (entity) {
    const msg = `di.uniqueId: ${rgb.di.uniqueId} to entity identifier: ${rgb.di.entityId}`;
    logger.info(true, 'APP', 'Mir has entity to connect', msg);

    await createRgb(rgb as rgb);
  }
};
