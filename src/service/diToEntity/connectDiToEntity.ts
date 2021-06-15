import { connectDiToEntityApi, diApi } from '../../api/rgb';
import { logInfo } from '../../logger/logger';

export const connectDiToEntity = async (entityId: string, diId: string) => {
  const res = await connectDiToEntityApi(entityId, diId);
  if (!res) {
    logInfo('Retry to connect entity to di', { entityId, diId });
    await diApi.connectToEntity(entityId, diId);
  }
};
