import { entityApi } from '../api/entity';
import { connectDiToEntityApi } from '../api/rgb';
import { pushToArray, getArray, getAllKeys, delValue } from './redis';

export const connectDiToEntity = async (entityIdentifier: string, diId: string) => {
  const entity = await entityApi.get(entityIdentifier);

  if (entity) {
    // TODO delete _id
    connectDiToEntityApi(entity.id || entity['_id'], diId);
  } else {
    pushToArray(entityIdentifier, diId);
  }
};

export const handleEntityEvent = async (entityId: string) => {
  const data = await getArray(entityId);

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      await connectDiToEntityApi(entityId, data[i]);
    }
  }

  delValue(entityId);
};

export const runAll = async () => {
  const keys = await getAllKeys();

  keys.forEach(async (entityId) => {
    if (await entityApi.get(entityId)) {
      handleEntityEvent(entityId);
    }
  });
};
