export interface entity {
  identityCard?: string;
  personalNumber?: string;
  goalUserId?: string;
  pictures?: { profile?: { meta: { updateAt: string } }; avatar?: { meta: { updateAt: string } } };
}
export interface krtflEntity {
  id: string;
  identityCard?: string;
  goalUserId?: string;
  personalNumber?: string;
  pictures?: { profile?: { meta: { updateAt: string } }; avatar?: { meta: { updateAt: string } } };
}
