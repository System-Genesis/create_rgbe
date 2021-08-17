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

export const entityEvent = async (entityId: string) => {
  const data = await getArray(entityId);

  if (data.length > 0) {
    data.forEach((diId) => connectDiToEntityApi(entityId, diId));
  }

  delValue(entityId);
};

export const runAll = async () => {
  const keys = await getAllKeys();

  keys.forEach(async (entityId) => {
    if (await entityApi.get(entityId)) {
      entityEvent(entityId);
    }
  });
};
