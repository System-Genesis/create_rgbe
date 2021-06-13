import { entityApi } from '../../api/entity';
import { logInfo } from '../../logger/logger';
import { krtflEntity, entity } from '../../types/entityType';
import { diff } from '../../util/utils';

export const insertEntity = async (entity: entity) => {
  let krtflEntity: krtflEntity | undefined;
  const entityId = entity.goalUserId || entity.identityCard || entity.personalNumber;

  krtflEntity = await entityApi.get(entityId!);

  if (!krtflEntity) {
    await entityApi.create(entity);
  } else {
    const diffEntity = diff(entity, krtflEntity);

    if (Object.keys(krtflEntity).length > 0) {
      await entityApi.update(krtflEntity.id, diffEntity);
    } else {
      logInfo('Nothing to update', krtflEntity.id);
    }
  }

  logInfo('Inserted entity successfully', krtflEntity.id);
};

// export const insertEntity = async (entity: entity) => {
//   let krtflEntityPN: krtflEntity | undefined;
//   let krtflEntityIC: krtflEntity | undefined;
//   let krtflEntity: krtflEntity | undefined;

//   if (entity.personalNumber) krtflEntityPN = await entityApi.get(entity.personalNumber);
//   if (entity.identityCard) krtflEntityIC = await entityApi.get(entity.identityCard);
//   if (entity.goalUserId) krtflEntity = await entityApi.get(entity.goalUserId);

//   if (!(krtflEntity && krtflEntityPN && krtflEntityIC)) {
//     await entityApi.create(entity);
//   } else {
//     if (krtflEntityPN && krtflEntityIC) {
//       // handle DI
//       // disconnect
//       // connect IC
//       await entityApi.deleteEntity(krtflEntityPN.personalNumber as string);
//     }

//     krtflEntity = krtflEntity || krtflEntityIC || krtflEntityPN;

//     const diffEntity = diff(entity, krtflEntity);

//     if (Object.keys(krtflEntity).length === 0) {
//       await entityApi.update(krtflEntity.id, diffEntity);
//     } else {
//       logInfo('Nothing to update', krtflEntity);
//     }
//   }

//   logInfo('Inserted entity successfully');
// };
