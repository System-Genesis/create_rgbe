import { entityApi } from '../../api/entity';
import { logInfo } from '../../logger/logger';
import { entity } from '../../types/entityType';
import { diff } from '../../util/utils';

export const insertEntity = async (entity: entity) => {
  let krtflEntityPN: any | undefined;
  let krtflEntityIC: any | undefined;
  let krtflEntity: any | undefined;

  if (entity.personalNumber) krtflEntityPN = await entityApi.getEntity(entity.personalNumber);
  if (entity.identityCard) krtflEntityIC = await entityApi.getEntity(entity.identityCard);
  if (entity['goalUserId']) krtflEntity = await entityApi.getEntity(entity['goalUserId']);

  if (!krtflEntity && !krtflEntityPN && !krtflEntityIC) {
    await entityApi.createEntity(entity);
  } else {
    if (krtflEntityPN && krtflEntityIC) {
      await entityApi.deleteEntity(krtflEntityPN._id);
    }

    krtflEntity = krtflEntity || krtflEntityIC || krtflEntityPN;

    const diffEntity = diff(entity, krtflEntity);
    await entityApi.updateEntity(krtflEntity['_id'], diffEntity);
  }

  logInfo('Inserted entity successfully');
};
