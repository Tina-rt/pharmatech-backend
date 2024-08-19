"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("adresse", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pays: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      ville: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      code_postal: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      code_adresse: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("adresse");
  },
};
