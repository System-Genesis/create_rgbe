import { entityApi } from '../api/entity';
import { connectDiToEntityApi } from '../api/rgb';
import { pushToArray, getArray, getAllKeys, delValue } from './redis';

export const connectDiToEntity = async (entityId: string, diId: string) => {
  const entity = await entityApi.get(entityId);

  if (entity) {
    connectDiToEntityApi(entityId, diId);
  } else {
    pushToArray(entityId, diId);
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
