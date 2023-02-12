import { Client } from "@notionhq/client"
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import * as Sentry from "@sentry/node"

import logger from "../utils/logger"
import NotionRepository from "./NotionRepository"

export default class NotionRepositoryImpl implements NotionRepository {
  notion;

  constructor(userAccessToken: string) {
    this.notion = new Client({ auth: userAccessToken });
  }

  async getNotionDatabase(databaseId: string): Promise<QueryDatabaseResponse> {
    try {
      return await this.notion.databases
        .retrieve({
          database_id: databaseId,
        })
        .then(() => {
          logger.info(`Queried Notion database ${databaseId}`);
        });
    } catch (err) {
      logger.error(err);
      Sentry.captureException(err);
    }
  }
}
