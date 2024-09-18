"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("facture", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      commande_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "commande",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      numero_facture: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      date_emission: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      montant_total: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      statut_paiement: {
        type: Sequelize.ENUM(
          "en attente",
          "paye",
          "partiellement paye",
          "rembourse"
        ),
        allowNull: false,
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
    await queryInterface.dropTable("facture");
  },
};
