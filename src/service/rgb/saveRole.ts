import { roleApi } from '../../api/rgb';
import { role } from '../../types/rgbType';
import { diff } from '../../util/utils';
import { logError, logInfo } from './../../logger/logger';
/**
 * Create/update(the fields with changes) from given role to kartoffel
 * And connect to his di and og
 * @param role the got from rgb object
 * @param ogId to connect to role
 * @param diId to connect to role
 */
export const insertRole = async (role: role, ogId: string, diId: string) => {
  let krtflRole = await roleApi.get(role.roleId);

  if (!krtflRole) {
    role.directGroup = ogId;

    krtflRole = await roleApi.create(role);

    if (krtflRole) connectRoleToDI(diId, role);

    if (krtflRole) logInfo('Role created', krtflRole);
    else throw { msg: 'Role not created', identifier: role.roleId };
  } else {
    const diffRole = diff(role, krtflRole);

    connectRoleToOG(ogId, krtflRole);
    connectRoleToDI(diId, krtflRole);

    if (Object.keys(diffRole).length > 0) {
      await roleApi.update(krtflRole.roleId, role);
      logInfo('Role was updated', krtflRole);
    } else {
      logInfo('Nothing to update', krtflRole);
    }
  }
};

/**
 * Connect role to OG
 * @param ogId to send to kartoffel api
 * @param krtflRole to send to kartoffel api
 */
async function connectRoleToOG(ogId: string, krtflRole: role) {
  if (ogId !== krtflRole.directGroup) {
    try {
      await roleApi.connectToOG(krtflRole.roleId, ogId);
      logInfo(`Role ${krtflRole.roleId} moved to OG ${ogId}`);
    } catch (error: any) {
      logError(`Role ${krtflRole.roleId} not connected to OG ${ogId}`);
    }
  }
}

/**
 * Connect role to di
 * @param diId to send to kartoffel api
 * @param krtflRole to send to kartoffel api
 */
async function connectRoleToDI(diId: string, krtflRole: role) {
  if (diId !== krtflRole.digitalIdentityUniqueId) {
    try {
      if (krtflRole.digitalIdentityUniqueId) {
        await roleApi.disconnectToDI(krtflRole.roleId, krtflRole.digitalIdentityUniqueId);
      }

      await roleApi.connectToDI(krtflRole.roleId, diId);
      logInfo(`Role ${krtflRole.roleId} moved to DI ${diId}`);
    } catch (error: any) {
      logError(`Role ${krtflRole.roleId} not connected to DI ${diId}`);
    }
  }
}
