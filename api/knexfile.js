const path = require("path");
require('dotenv').config()

module.exports = {
  development: {
    client: process.env.DATABASE_CLIENT ?? "sqlite3",
    connection:  process.env.DATABASE_CLIENT ? process.env.DATABASE_URL : { filename: path.resolve(__dirname, "src", "database", "database.db")},
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations")
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "seeds")
    },
    useNullAsDefault: true
  }
};