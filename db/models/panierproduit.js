"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const panierProduit = sequelize.define(
  "panierProduit",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    panier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "panier",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    produit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "produit",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "La quantité doit être au moins 1.",
        },
        notEmpty: {
          msg: "Veuillez indiquer la quantité.",
        },
      },
    },
    prix_unitaire: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Le prix unitaire doit être un nombre décimal valide.",
        },
        min: {
          args: [0],
          msg: "Le prix unitaire ne peut pas être négatif.",
        },
        notEmpty: {
          msg: "Veuillez indiquer le prix unitaire.",
        },
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "panierProduit",
  }
);

module.exports = panierProduit;
