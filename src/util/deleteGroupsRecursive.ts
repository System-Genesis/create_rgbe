import { entityApi } from '../api/entity';
import { ogApi } from '../api/og';
import logs from '../logger/logs';
import { og } from '../types/rgbType';

async function groupHasNoRoles(ogId: string) {
  const members = await entityApi.getDirectMembersUnderGroup(ogId);
  return members.length === 0;
}

export const deleteEmptyGroupsRecursive = async (ogId: string) => {
  const krtflOg: og = await ogApi.getById(ogId);
  if (krtflOg.isLeaf && (await groupHasNoRoles(ogId))) {
    await ogApi.delete(ogId);
    logs.OG.DELETE(krtflOg.hierarchy, krtflOg.name, krtflOg.id);
    if (krtflOg.directGroup) await deleteEmptyGroupsRecursive(krtflOg.directGroup);
  }
};
