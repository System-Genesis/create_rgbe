import { roleApi } from '../../api/role';
import logs from '../../logger/logs';
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

    krtflRole ? logs.ROLE.CREATE(krtflRole.roleId) : logs.ROLE.FAIL_TO_CREATE(krtflRole.roleId);
  } else {
    const diffRole = diff(role, krtflRole);

    connectRoleToOG(ogId, krtflRole);
    connectRoleToDI(diId, krtflRole);

    if (Object.keys(diffRole).length == 0) {
      logs.ROLE.ALREADY_UP_TO_DATE(krtflRole.roleId);
    } else {
      const updated = await roleApi.update(krtflRole.roleId, diffRole);

      updated ? logs.ROLE.UPDATE(krtflRole.roleId, diffRole) : logs.ROLE.FAIL_TO_UPDATE(krtflRole.roleId, diffRole);
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
      logs.ROLE.CONNECT_TO_OG(krtflRole.roleId, ogId);
    } catch (error: any) {
      logs.ROLE.FAIL_TO_CONNECT_TO_OG(krtflRole.roleId, ogId, error);
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
      logs.ROLE.CONNECT_TO_DI(krtflRole.roleId, diId);
    } catch (error: any) {
      logs.ROLE.FAIL_TO_CONNECT_TO_DI(krtflRole.roleId, diId, error);
    }
  }
}
