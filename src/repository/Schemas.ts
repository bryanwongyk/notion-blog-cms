const accountsSchema = {
  table: "accounts",
  id: "id",
  name: "name",
  createdAt: "createdAt",
};

const authorizationsSchema = {
  table: "authorizations",
  userId: "user_id",
  workspaceId: "workspace_id",
  accessToken: "access_token",
  botId: "bot_id",
  createdAt: "created_at",
};

export { accountsSchema, authorizationsSchema };
