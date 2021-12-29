export type og = {
  id: string;
  // TODO delete
  _id?: string;
  hierarchy: string;
  ancestors: string[];
  name: string;
  source: string;
  directGroup?: string;
};

export type postOg = {
  name: string;
  source: string;
  directGroup?: string;
};

export type di = { uniqueId: string; entityId?: string };
export type role = { roleId: string; directGroup: string; digitalIdentityUniqueId?: string };

export type rgb = {
  og: og | null;
  di: di;
  role: role | null;
};
