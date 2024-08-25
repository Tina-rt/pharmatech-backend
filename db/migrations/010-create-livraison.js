"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("livraison", {
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
      nom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [9, 16],
        },
      },
      adresse: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prescription: {
        type: Sequelize.STRING,
      },
      ville: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      code_postal: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date_livraison: {
        type: Sequelize.DATE,
      },
      transporteur: {
        type: Sequelize.STRING,
      },
      numero_suivi: {
        type: Sequelize.STRING,
      },
      statut_livraison: {
        type: Sequelize.ENUM("En attente", "En transit", "Livree", "Retour"),
        defaultValue: "En attente",
      },
      methode_livraison_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "methodeLivraison",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("livraison");
  },
};
