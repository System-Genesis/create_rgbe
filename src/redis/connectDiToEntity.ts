import menash from 'menashmq';
import config from '../config/env.config';
import { logInfo } from '../logger/logger';
import { entityApi } from '../api/entity';
import { connectDiToEntityApi } from '../api/rgb';
import { delValue, getValue, setValue } from './redis';

export const connectDiToEntity = async (entityId: string, diId: string) => {
  const entity = await entityApi.get(entityId);

  if (entity) {
    connectDiToEntityApi(entityId, diId);
  } else {
    const value = await getValue(entityId);

    let data: string[];

    if (value) {
      data = JSON.parse(value);
      data.push(diId);
    } else {
      data = [diId];
    }

    setValue(entityId, JSON.stringify(data));
  }

  logInfo(`Send to connectDiToEntity queue entity: ${entityId}, diId: ${diId}`);
  menash.send(config.rabbit.connectDiToEntity, { entityId, diId });
};

export const entityEvent = async (entityId: string) => {
  const value = await getValue(entityId);

  if (value) {
    const data: string[] = JSON.parse(value);
    data.forEach((diId) => connectDiToEntityApi(entityId, diId));
  }

  delValue(entityId);
};
