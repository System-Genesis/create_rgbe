import logger from 'logger-genesis';
import { entityApi } from '../api/entity';
import { connectDiToEntityApi } from '../api/rgb';
import { pushToArray, getArray, getAllKeys, delValue } from './redis';

export const connectDiToEntity = async (entityIdentifier: string, diId: string) => {
  const entity = await entityApi.get(entityIdentifier);

  if (entity) {
    // TODO delete _id
    connectDiToEntityApi(entity.id || entity['_id'], diId);
    logger.logInfo(false, 'Entity connected to DI', 'APP', '', {
      entity: entityIdentifier,
      di: diId,
    });
  } else {
    pushToArray(entityIdentifier, diId);
  }
};

export const handleEntityEvent = async (entityIdentifier: string, entId: string) => {
  const data = await getArray(entityIdentifier);

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      await connectDiToEntityApi(entId, data[i]);
      logger.logInfo(false, 'Entity connected to DI', 'APP', '', { entity: entId, di: data[i] });
    }
  }

  delValue(entityIdentifier);
};

export const runAll = async () => {
  const keys = await getAllKeys();

  for (let i = 0; i < keys.length; i++) {
    const entityIdentifier = keys[i];
    const ent = await entityApi.get(entityIdentifier);
    if (ent) {
      handleEntityEvent(entityIdentifier, ent.id || ent['_id']);
    }
  }
};
