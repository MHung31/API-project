"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = "Users";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(options, "Users", "firstName", {
      type: Sequelize.STRING(30),
      allowNull: false,
    });

    await queryInterface.addColumn(options, "Users", "lastName", {
      type: Sequelize.STRING(30),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(options, "Users", "firstName");
    await queryInterface.removeColumn(options, "Users", "lastName");
  },
};
