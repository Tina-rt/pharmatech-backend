"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("produit", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nom: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      prix: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      image: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      categorie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categorie",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      marque: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      numero_serie: {
        type: Sequelize.STRING(100),
        unique: true,
      },
      caracteristique_principale: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      reduction: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      tva_pourcentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 20.0,
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
    await queryInterface.dropTable("produit");
  },
};
