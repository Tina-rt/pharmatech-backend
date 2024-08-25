"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("commande", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      utilisateur_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "utilisateur",
          key: "id",
        },
      },
      panier_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "panier",
          key: "id",
        },
      },
      date_commande: {
        type: Sequelize.DATE,
      },
      statut: {
        type: Sequelize.ENUM(
          "en attente",
          "en cours",
          "expediee",
          "livree",
          "annulee"
        ),
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
    await queryInterface.dropTable("commande");
  },
};
