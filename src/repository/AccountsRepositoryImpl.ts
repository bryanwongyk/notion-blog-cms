import { Knex } from "knex"

import AccountsRepository from "./AccountsRepository"

export default class AccountsRepositoryImpl implements AccountsRepository {
  knexTemplate;

  constructor(knexTemplate) {
    this.knexTemplate = knexTemplate;
  }

  async insertAccount(id: string, name: string): Promise<Knex.Transaction> {
    return await this.knexTemplate("accounts").insert({
      id: id,
      name: name,
    });
  }
}
