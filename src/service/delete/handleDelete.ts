import { diApi, disconnectDiToEntityApi } from '../../api/di';
import { roleApi } from '../../api/role';
import logger from 'logger-genesis';

export const deleteDIAndRole = async (uniqueId: string) => {
  const krtflDi = await diApi.get(uniqueId);

  if (!krtflDi) return;

  await disconnectDiToEntityApi(krtflDi.entityId, uniqueId);
  logger.info(true, 'APP', 'Disconnect DI', `DI: ${uniqueId} disconnected from entity ${krtflDi.entityId}`);

  if (krtflDi.role) {
    await roleApi.disconnectToDI(krtflDi.role.roleId, uniqueId);
    logger.info(true, 'APP', 'Disconnect Role', `Role: ${krtflDi.role.roleId} disconnected from DI ${uniqueId}`);

    await roleApi.delete(uniqueId);
    logger.info(true, 'APP', 'Delete Role', `Role with roleId ${krtflDi.role.roleId} deleted`);
  }

  await diApi.delete(uniqueId);
  logger.info(true, 'APP', 'Delete DI', `DI with uniqueId ${uniqueId} deleted`);
};
