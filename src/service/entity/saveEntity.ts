import { createEntity, deleteEntity, getEntity, updateEntity } from '../../api/entity';
import { logInfo } from '../../logger/logger';
import { entity } from '../../types/entityType';
import { diff } from '../../util/utils';

export const insertEntity = async (entity: entity) => {
  let krtflEntityPN: any | undefined;
  let krtflEntityIC: any | undefined;
  let krtflEntity: any | undefined;

  if (entity.personalNumber) krtflEntityPN = await getEntity(entity.personalNumber);
  if (entity.identityCard) krtflEntityIC = await getEntity(entity.identityCard);
  if (entity['goalUserId']) krtflEntity = await getEntity(entity['goalUserId']);

  if (!krtflEntity && !krtflEntityPN && !krtflEntityIC) {
    await createEntity(entity);
  } else {
    if (krtflEntityPN && krtflEntityIC) {
      await deleteEntity(krtflEntityPN._id);
    }

    krtflEntity = krtflEntity || krtflEntityIC || krtflEntityPN;

    const diffEntity = diff(entity, krtflEntity);
    await updateEntity(krtflEntity['_id'], diffEntity);
  }

  logInfo('Inserted entity successfully');
};
