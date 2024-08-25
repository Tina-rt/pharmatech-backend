"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define(
  "paiement",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    commande_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "commande",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Le montant doit être un nombre décimal valide.",
        },
        min: {
          args: [0],
          msg: "Le montant ne peut pas être négatif.",
        },
        notEmpty: {
          msg: "Veuillez indiquer le montant du paiement.",
        },
      },
    },
    date_paiement: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    mode_paiement: {
      type: Sequelize.ENUM("carte", "virement", "mobile money"),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Veuillez indiquer le mode de paiement.",
        },
        isIn: {
          args: [["carte", "virement", "mobile money"]],
          msg: "Le mode de paiement n'est pas valide.",
        },
      },
    },
    statut_paiement: {
      type: Sequelize.ENUM("en attente", "payé", "échec"),
      allowNull: false,
      defaultValue: "en attente",
      validate: {
        isIn: {
          args: [["en attente", "payé", "échec"]],
          msg: "Le statut du paiement n'est pas valide.",
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
    modelName: "paiement",
  }
);
