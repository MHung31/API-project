// backend/config/database.js
const config = require("./index");

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
  },
  //switch production to check production items
  //Switch package.json production to nodemon so changes in code will restart server
  // production: {
  //   storage: config.dbFile,
  //   dialect: "sqlite",
  //   seederStorage: "sequelize",
  //   logQueryParameters: true,
  //   typeValidation: true,
  // },

  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      schema: process.env.SCHEMA,
    },
  },
};
