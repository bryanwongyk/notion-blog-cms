import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `
            CREATE TABLE public.accounts (
                id                              TEXT            NOT NULL PRIMARY KEY,
                name                            TEXT            NOT NULL,
                created_at                      TIMESTAMP       NOT NULL DEFAULT now()
            );

            CREATE TABLE public.authorizations (
                user_id                         TEXT            NOT NULL,
                bot_id                          TEXT            NOT NULL,
                access_token                    TEXT            NOT NULL,
                workspace_id                    TEXT            NOT NULL,
                created_at                      TIMESTAMP       NOT NULL DEFAULT now(),
                PRIMARY KEY (user_id, workspace_id, access_token)
            );
        `
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE public.accounts;
    DROP TABLE public.authorizations;
  `);
}
