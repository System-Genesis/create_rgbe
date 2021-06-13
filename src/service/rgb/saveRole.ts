import { roleApi } from '../../api/rgb';
import { role } from '../../types/rgbType';
import { diff } from '../../util/utils';
import { logError, logInfo } from './../../logger/logger';

export const insertRole = async (role: role, ogId: string, diId: string) => {
  let krtflRole = await roleApi.get(role.roleId);

  if (!krtflRole) {
    role.directGroup = ogId;
    role.digitalIdentityUniqueId = diId;

    krtflRole = await roleApi.create(role);
    logInfo('Role created', krtflRole);
  } else {
    const diffRole = diff(role, krtflRole);

    connectRoleToOG(diffRole, ogId, krtflRole);
    connectRoleToDI(diffRole, diId, krtflRole);

    if (Object.keys(krtflRole).length === 0) {
      try {
        await roleApi.update(krtflRole._id, role);
        logInfo('Role was updated', krtflRole);
      } catch (error) {
        logInfo('Role was not updated', krtflRole);
      }
    } else {
      logInfo('Nothing to update', krtflRole);
    }
  }

  return krtflRole;
};

async function connectRoleToOG(diffRole: any, ogId: string, krtflRole: role) {
  if (diffRole.targetGroup) {
    const targetGroup = diffRole.targetGroup;
    delete diffRole.targetGroup;

    if (targetGroup !== ogId) {
      try {
        await roleApi.connectToOG(krtflRole.roleId, ogId);
        logInfo(`Role ${krtflRole.roleId} connected to OG ${ogId}`);
      } catch (error) {
        logError(`Role ${krtflRole.roleId} not connected to OG ${ogId}`);
      }
    }
  }
}

async function connectRoleToDI(diffRole: any, diId: string, krtflRole: any) {
  if (diffRole.di) {
    const di = diffRole.di;
    delete diffRole.di;

    if (di !== diId) {
      try {
        await roleApi.connectToDI(krtflRole._id, diId);
        logInfo(`Role ${krtflRole.roleId} connected to OG ${diId}`);
      } catch (error) {
        logError(`Role ${krtflRole.roleId} not connected to OG ${diId}`);
      }
    }
  }
}
