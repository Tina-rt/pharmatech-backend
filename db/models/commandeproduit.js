"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const commandeProduit = sequelize.define(
  "commandeProduit",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    commande_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "commande",
        key: "id",
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: "ID commande requis",
        },
      },
    },
    produit_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "produit",
        key: "id",
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: "ID produit requis",
        },
      },
    },
    prix_unitaire: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prixHTtotal: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    tva_pourcentage: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    prixTVA: {
      type: DataTypes.DECIMAL,
      allowNull: false,
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
    modelName: "commandeProduit",
  }
);

module.exports = commandeProduit;
