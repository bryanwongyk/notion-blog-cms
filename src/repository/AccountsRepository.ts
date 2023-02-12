import { Knex } from "knex"

export default interface AccountsRepository {
  upsertAccount(id: string, name: string): Promise<Knex.Transaction>;
}
