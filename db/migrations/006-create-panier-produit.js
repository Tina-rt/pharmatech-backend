"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("panierProduit", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      panier_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "panier",
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
      quantite: {
        type: Sequelize.INTEGER,
      },
      prix_unitaire: {
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
    await queryInterface.dropTable("panierProduit");
  },
};
