import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"

export default interface NotionRepository {
  getNotionDatabase(databaseId: string): Promise<QueryDatabaseResponse>;
}
