"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("panier", {
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
      statut: {
        type: Sequelize.ENUM("actif", "pret", "valide", "commande", "ferme"),
        defaultValue: "actif",
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
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("panier");
  },
};
