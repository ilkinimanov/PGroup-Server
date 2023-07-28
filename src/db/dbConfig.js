require('dotenv').config({ path: "./.env" });


module.exports = {
  dbName: process.env.DATABASE_NAME,
  dbUser: process.env.DATABASE_USER,
  dbPassword: process.env.DATABASE_PASSWORD,
  dbHost: process.env.DATABASE_HOST,
  dbDialect: process.env.DATABASE_DIALECT
}
