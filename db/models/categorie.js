"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const produit = require("./produit");
const categorie = sequelize.define(
  "categorie",
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
          msg: "Donnez le nom de cette categorie",
        },
      },
    },
    createdAt: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "categorie",
  }
);

categorie.hasMany(produit, { foreignKey: "categorie_id" });
produit.belongsTo(categorie, { foreignKey: "categorie_id" });

module.exports = categorie;
