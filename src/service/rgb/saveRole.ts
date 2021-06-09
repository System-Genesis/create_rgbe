import { roleApi } from '../../api/rgb';
import { logInfo } from '../../logger/logger';
import { diff } from '../../util/utils';

export const insertRole = async (role: { _id: string }, ogId: string, diId: string) => {
  let targetGroup: string | undefined;
  let di: string | undefined;

  let krtflRole = await roleApi.get(role._id);

  if (!krtflRole) {
    role['targetGroup'] = ogId;
    role['di'] = diId;

    krtflRole = await roleApi.create(role);
    logInfo('Role created', krtflRole);
  } else {
    const diffROle = diff(role, krtflRole);

    if (diffROle.targetGroup) {
      targetGroup = diffROle.targetGroup;
      if (targetGroup !== ogId) roleApi.connectToOG(krtflRole._id, ogId);
      delete diffROle.targetGroup;
    }

    if (diffROle.di) {
      di = diffROle.di;
      if (di !== diId) roleApi.connectToDI(krtflRole._id, diId);
      delete diffROle.di;
    }

    await roleApi.update(krtflRole._id, role);
    logInfo('Role was updated', krtflRole);
  }

  return krtflRole;
};
