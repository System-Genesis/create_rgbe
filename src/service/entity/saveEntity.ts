import { entityApi } from '../../api/entity';
import { logInfo } from '../../logger/logger';
import { entityEvent } from '../../redis/connectDiToEntityRedis';
import { entity } from '../../types/entityType';
import { diff } from '../../util/utils';

/**
 * Create/update (only fields that change) entity from buildEntity queue to kartoffel
 * @param entity - from buildEntity queue
 */
export const insertEntity = async (entity: entity) => {
  let krtflEntity = await getExistsEntity(entity);

  if (!krtflEntity) {
    krtflEntity = await entityApi.create(entity);
    logInfo('Entity created successfully', krtflEntity?.id);
    entityEvent(entity.identityCard || entity.personalNumber || entity.goalUserId!);
  } else {
    const diffEntity = diff(entity, krtflEntity);

    if (Object.keys(diffEntity).length > 0) {
      await entityApi.update(krtflEntity.id, diffEntity);
      logInfo('Entity updated successfully', krtflEntity?.id);
    } else {
      logInfo('Nothing to update', krtflEntity.id);
    }
  }
};

/**
 * Search entity in kartofel by goalUserId or identityCard and/or personalNumber
 * If has identityCard but not found steel need to check by personalNumber
 * If there in so identityCard field than personalNumber must to exist
 * @param entity from queue
 * @returns kartofel entity / null
 */
export async function getExistsEntity(entity: entity) {
  if (entity.goalUserId) return await entityApi.get(entity.goalUserId);

  return (
    (await entityApi.get(entity.identityCard || entity.personalNumber!)) ||
    (await entityApi.get(entity.personalNumber!))
  );
}

// if we will delete old entity when find two entity related
//
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
