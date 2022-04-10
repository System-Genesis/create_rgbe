import { diApi, disconnectDiToEntityApi } from '../../api/di';
import { roleApi } from '../../api/role';
import logs from '../../logger/logs';

export const deleteDIAndRole = async (uniqueId: string) => {
  const krtflDi = await diApi.get(uniqueId);

  if (!krtflDi) return;

  await disconnectDiToEntityApi(krtflDi.entityId, uniqueId);
  logs.DI.DISCONNECTED_FROM_ENTITY(uniqueId, krtflDi.entityId);

  if (krtflDi.role) {
    await roleApi.disconnectToDI(krtflDi.role.roleId, uniqueId);
    logs.ROLE.DISCONNECT_FROM_DI(krtflDi.role.roleId, uniqueId);

    await roleApi.delete(krtflDi.role.roleId);
    logs.ROLE.DELETE(krtflDi.role.roleId);
  }

  await diApi.delete(uniqueId);
  logs.DI.DELETE(uniqueId);
};
