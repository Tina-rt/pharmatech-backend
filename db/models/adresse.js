"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
module.exports = sequelize.define(
  "adresse",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    pays: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Veuillez mettre le pays",
        },
      },
    },
    ville: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    code_postal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Veuillez mettre la code postal",
        },
        isInt: {
          msg: "Code Postale du ville en Entier",
        },
      },
    },
    code_adresse: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: " Veuillez mettre l'endroit exact ou l'adresse exacte de la livraison",
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
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "adresse",
  }
);
