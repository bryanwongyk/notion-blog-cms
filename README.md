# notion-blog-cms

Running Postgres Locally

1. Run database container: `docker-compose up`
2. Run database migration: `cd database/database_migrations && knex migrate:latest && cd .. && cd ..`

To access database directly:

1. Connect to the Postgres container by running `psql -h localhost -p 5432 -U postgres -W postgres`. Add in password `postgres`.
2. Access your database using `\c database_name` e.g. `\c notion_cms`
3. View all your tables using `\dt`
4. You can run SQL queries as well but make sure to terminate with ;

To take down Postgres server:
`docker-compose down`

To delete contents inside Postgres database (which is persisted in a volume):
In psql run `DROP SCHEMA public CASCADE;` and then `CREATE SCHEMA public;`

To view tables inside Postgres database run `\dt`

1. Pull relevant Docker image: `docker pull postgres:15.2`
2. Run PG shell script that spins up Docker container: `sudo ./database/run-postgres.sh`
3. Access PG container using psql: `psql postgres://postgres:password@localhost:5432/postgres`
4. Create the database locally in psql: `CREATE DATABASE notion_cms`
