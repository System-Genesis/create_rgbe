import { logInfo } from "./../logger/logger";
import { entityApi } from "../api/entity";
import { connectDiToEntityApi } from "../api/rgb";
import { pushToArray, getArray, getAllKeys, delValue } from "./redis";

export const connectDiToEntity = async (
  entityIdentifier: string,
  diId: string
) => {
  const entity = await entityApi.get(entityIdentifier);

  if (entity) {
    // TODO delete _id
    connectDiToEntityApi(entity.id || entity["_id"], diId);
  } else {
    pushToArray(entityIdentifier, diId);
  }
};

export const handleEntityEvent = async (
  entityIdentifier: string,
  entId: string
) => {
  const data = await getArray(entityIdentifier);

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      await connectDiToEntityApi(entId, data[i]);
      logInfo("entity connected", { entity: entId, di: data[i] });
    }
  }

  delValue(entityIdentifier);
};

export const runAll = async () => {
  const keys = await getAllKeys();

  keys.forEach(async (entityIdentifier) => {
    const ent = await entityApi.get(entityIdentifier);
    if (ent) {
      handleEntityEvent(entityIdentifier, ent.id || ent["_id"]);
    }
  });
};
