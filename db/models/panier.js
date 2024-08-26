"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const utilisateur = require("./utilisateur");
const commande = require("./commande");
const panierProduit = require("./panierproduit");

const panier = sequelize.define(
  "panier",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    utilisateur_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "utilisateur",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    statut: {
      type: DataTypes.ENUM("actif", "pret", "valide", "commande", "ferme"),
      allowNull: false,
      defaultValue: "actif",
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
    modelName: "panier",
  }
);

panier.hasMany(panierProduit, { foreignKey: "panier_id" });
panierProduit.belongsTo(panier, { foreignKey: "panier_id" });
panier.hasOne(commande, { foreignKey: "panier_id" });
commande.belongsTo(panier, { foreignKey: "panier_id" });

module.exports = panier;
