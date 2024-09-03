"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("commandeProduit", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      commande_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "commande",
          key: "id",
        },
      },
      produit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "produit",
          key: "id",
        },
      },
      prix_unitaire: {
        type: Sequelize.DECIMAL,
      },
      quantite: {
        type: Sequelize.INTEGER,
      },
      prixHTtotal: {
        type: Sequelize.DECIMAL,
      },
      tva_pourcentage: {
        type: Sequelize.DECIMAL,
      },
      prixTVA: {
        type: Sequelize.DECIMAL,
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
    await queryInterface.dropTable("commandeProduit");
  },
};
