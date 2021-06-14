import { connectDiToEntityApi } from '../../api/rgb';

export const connectDiToEntity = async (entityId: string, diId: string) => {
  console.log(
    '🚀 ~ file: connectDiToEntity.ts ~ line 6 ~ connectDiToEntity ~ connectDiToEntity',
    connectDiToEntity
  );
  await connectDiToEntityApi(entityId, diId);
};
