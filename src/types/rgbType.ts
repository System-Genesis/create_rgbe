export type og = { id: string; hierarchy: string };
export type di = { uniqueId: string; entityId?: string };
export type role = { roleId: string; directGroup: string; digitalIdentityUniqueId: string };

export type rgb = {
  og: og;
  di: di;
  role: role;
};
