import { Knex } from "knex"

import * as Sentry from "@sentry/node"

import logger from "../utils/logger"
import AuthorizationsRepository from "./AuthorizationsRepository"
import { authorizationsSchema } from "./Schemas"

export default class AuthorizationsRepositoryImpl
  implements AuthorizationsRepository
{
  knexTemplate;

  constructor(knexTemplate) {
    this.knexTemplate = knexTemplate;
  }

  async upsertAuthorization(
    userId: string,
    workspaceId: string,
    accessToken: string,
    botId: string
  ): Promise<Knex.Transaction> {
    try {
      return await this.knexTemplate(authorizationsSchema.table)
        .insert({
          user_id: userId,
          workspace_id: workspaceId,
          access_token: accessToken,
          bot_id: botId,
        })
        .onConflict([
          authorizationsSchema.userId,
          authorizationsSchema.workspaceId,
          authorizationsSchema.accessToken,
        ])
        .ignore()
        .then(() => {
          logger.info(
            `Authorization inserted {userId: ${userId}, workspaceId: ${workspaceId}, accessToken: ${accessToken}, botId: ${botId}}`
          );
        });
    } catch (err) {
      logger.error(err);
      Sentry.captureException(err);
    }
  }
}
