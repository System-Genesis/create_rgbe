import logger from 'logger-genesis';
import { roleApi } from '../../api/role';
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

    if (krtflRole) {
      logger.info(true, 'APP', 'Role created', `roleId: ${krtflRole.roleId} created`, { roleId: krtflRole.roleId });
    } else
      logger.error(true, 'APP', 'Role not created', `roleId: ${krtflRole.roleId} not created`, {
        roleId: krtflRole.roleId,
      });
  } else {
    const diffRole = diff(role, krtflRole);

    connectRoleToOG(ogId, krtflRole);
    connectRoleToDI(diId, krtflRole);

    if (Object.keys(diffRole).length > 0) {
      const updated = await roleApi.update(krtflRole.roleId, diffRole);

      const msgLog = `roleId: ${krtflRole.roleId} updated: ${Object.keys(diffRole)}`;
      if (updated) {
        logger.info(true, 'APP', 'Role updated', msgLog, {
          roleId: krtflRole.roleId,
          update: diffRole,
        });
      } else {
        logger.warn(true, 'APP', 'Role fail to updated', msgLog, {
          roleId: krtflRole.roleId,
          update: diffRole,
        });
      }
    } else {
      logger.info(true, 'APP', 'Role already up to date', `roleId: ${krtflRole.roleId}`, { roleId: krtflRole.roleId });
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
      logger.info(true, 'APP', 'Role connect to Group', moveMsg, { id: krtflRole.roleId });
    } catch (error: any) {
      logger.error(true, 'APP', 'Role fail to connect to Group ', moveMsg, { id: krtflRole.roleId, error });
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
      logger.info(true, 'APP', 'Role connect to DI', moveMsg, { roleId: krtflRole.roleId });
    } catch (error: any) {
      logger.error(true, 'APP', 'Role fail to connect to DI ', moveMsg, { roleId: krtflRole.roleId, error });
    }
  }
}
