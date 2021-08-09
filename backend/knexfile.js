// The connection string if required to connect to the Heroku Postgrsql database in production.
const connectionString = process.env.DATABASE_URL;

module.exports = {

  development: {
    client: 'postgres',
    connection: 'postgres://ahhjqjri:ZOomTrlXKyw8w8CBKHYCYEl4bdGHc-Zr@kashin.db.elephantsql.com/ahhjqjri'
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
