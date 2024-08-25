"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("paiement", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      commande_id: {
        type: Sequelize.INTEGER,
      },
      montant: {
        type: Sequelize.DECIMAL,
      },
      date_paiement: {
        type: Sequelize.DATE,
      },
      mode_paiement: {
        type: Sequelize.ENUM("carte", "virement", "mobile money"),
      },
      statut_paiement: {
        type: Sequelize.ENUM("en attente", "paye", "echec"),
        defaultValue: "en attente",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("paiement");
  },
};