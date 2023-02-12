import { Knex } from "knex"

export default interface AccountsRepository {
  insertAccount(id: string, name: string): Promise<Knex.Transaction>;
}
