"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const livraison = require("./livraison");

const methodeLivraison = sequelize.define(
  "methodeLivraison",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Le nom est important",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La description est important",
        },
      },
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Le prix est important",
        },
        isDecimal: {
          msg: "Le prix doit etre en format decimale",
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
    modelName: "methodeLivraison",
  }
);

module.exports = methodeLivraison;
