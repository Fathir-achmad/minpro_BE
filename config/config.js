require('dotenv').config()
module.exports = {
  development: {
    username: process.env.USERNAME_SQL,
    password: process.env.PASSWORD_SQL,
    database: process.env.DATABASE_NAME,
    host: "127.0.0.1",
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql"
  }
}
