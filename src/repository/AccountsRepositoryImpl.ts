import { Knex } from "knex"

import * as Sentry from "@sentry/node"

import logger from "../utils/logger"
import AccountsRepository from "./AccountsRepository"
import { accountsSchema } from "./Schemas"

export default class AccountsRepositoryImpl implements AccountsRepository {
  knexTemplate;

  constructor(knexTemplate) {
    this.knexTemplate = knexTemplate;
  }

  async upsertAccount(id: string, name: string): Promise<Knex.Transaction> {
    try {
      return await this.knexTemplate(accountsSchema.table)
        .insert({
          id: id,
          name: name,
        })
        .onConflict(accountsSchema.id)
        .ignore()
        .then(() => {
          logger.info(`Account inserted {id: ${id}, name: ${name}}`);
        });
    } catch (err) {
      logger.error(err);
      Sentry.captureException(err);
    }
  }
}
