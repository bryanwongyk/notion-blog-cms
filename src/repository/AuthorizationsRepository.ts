import { Knex } from "knex"

export default interface AuthorizationsRepository {
  upsertAuthorization(
    userId: string,
    workspaceId: string,
    accessToken: string,
    botId: string
  ): Promise<Knex.Transaction>;
}
