import { entityApi } from '../../api/entity';
import { rgbMir } from './../../types/rgbType';
import { rgb } from '../../types/rgbType';
import { createRgb } from './rgbHandler';
import logs from '../../logger/logs';

export const checkEntityExists = async (entityIdentifier: string | undefined) => {
  if (!entityIdentifier) return null;

  return (await entityApi.get(entityIdentifier)) ? entityIdentifier : null;
};

export const mirHandler = async (rgb: rgbMir) => {
  const identifiers = rgb.identifiers;

  if (!identifiers) {
    logs.MIR.WITHOUT_IDENTIFIERS(rgb.di.uniqueId);
  } else {
    const entityIdentifier =
      (await checkEntityExists(identifiers.goalUserId)) ||
      (await checkEntityExists(identifiers.identityCard)) ||
      (await checkEntityExists(identifiers.personalNumber));

    if (!entityIdentifier) {
      logs.MIR.HASNT_ENTITY(rgb.di.uniqueId);
    } else {
      logs.MIR.HAS_ENTITY(rgb.di.uniqueId, rgb.di.entityId!);

      rgb.di.entityId = entityIdentifier;
      await createRgb(rgb as rgb);
    }
  }
};
