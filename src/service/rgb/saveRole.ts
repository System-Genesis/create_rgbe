import logger from 'logger-genesis';
import { roleApi } from '../../api/rgb';
import { role } from '../../types/rgbType';
import { diff } from '../../util/utils';
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

    if (krtflRole) logger.logInfo(false, 'Role created', 'SYSTEM', '', { id: krtflRole.roleId });
    else throw { msg: 'Role not created', identifier: role.roleId };
  } else {
    const diffRole = diff(role, krtflRole);

    connectRoleToOG(ogId, krtflRole);
    connectRoleToDI(diId, krtflRole);

    if (Object.keys(diffRole).length > 0) {
      await roleApi.update(krtflRole.roleId, role);
      logger.logInfo(false, 'Role updated', 'SYSTEM', '', {
        id: krtflRole.roleId,
        update: diffRole,
      });
    } else {
      logger.logInfo(false, 'Role updated', 'SYSTEM', '', { id: krtflRole.roleId });
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
    const moveMsg = `Role: ${krtflRole.roleId}, Group: ${ogId}`;

    try {
      await roleApi.connectToOG(krtflRole.roleId, ogId);
      logger.logInfo(false, 'Role moved to Group', 'SYSTEM', moveMsg, { id: krtflRole.roleId });
    } catch (error: any) {
      logger.logError(false, 'Role fail to Group ', 'SYSTEM', moveMsg, {
        id: krtflRole.roleId,
        error,
      });
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
    const moveMsg = `Role: ${krtflRole.roleId}, DI: ${diId}`;

    try {
      if (krtflRole.digitalIdentityUniqueId) {
        await roleApi.disconnectToDI(krtflRole.roleId, krtflRole.digitalIdentityUniqueId);
      }

      await roleApi.connectToDI(krtflRole.roleId, diId);
      logger.logInfo(false, 'Role moved to DI', 'SYSTEM', moveMsg, { id: krtflRole.roleId });
    } catch (error: any) {
      logger.logError(false, 'Role fail to DI ', 'SYSTEM', moveMsg, {
        id: krtflRole.roleId,
        error,
      });
    }
  }
}
