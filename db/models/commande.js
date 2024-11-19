"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const paiement = require("./paiement");
const livraison = require("./livraison");
const facture = require("./facture");
const commandeProduit = require("./commandeproduit");

const commande = sequelize.define(
  "commande",
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
    date_commande: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    statut: {
      type: Sequelize.ENUM(
        "en attente",
        "en cours",
        "expediee",
        "livree",
        "annulee"
      ),
      allowNull: false,
      defaultValue: "en attente",
      validate: {
        isIn: {
          args: [["en attente", "en cours", "expediee", "livree", "annulee"]],
          msg: "Le statut de la commande n'est pas valide.",
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
    modelName: "commande",
  }
);

commande.hasMany(paiement, { foreignKey: "commande_id" });
paiement.belongsTo(commande, { foreignKey: "commande_id" });

commande.hasOne(livraison, { foreignKey: "commande_id" });
livraison.belongsTo(commande, { foreignKey: "commande_id" });

commande.hasOne(facture, { foreignKey: "commande_id" });
facture.belongsTo(commande, { foreignKey: "commande_id" });

commande.hasMany(commandeProduit, { foreignKey: "commande_id" });
commandeProduit.belongsTo(commande, { foreignKey: "commande_id" });

module.exports = commande;
