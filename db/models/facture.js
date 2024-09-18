"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const facture = sequelize.define(
  "facture",
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
      validate: {
        notEmpty: {
          msg: "La reference de la commande est requise.",
        },
      },
    },
    numero_facture: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Le numero de la facture est requis.",
        },
        len: {
          args: [5, 50],
          msg: "Le numero de la facture doit comporter entre 5 et 50 caracteres.",
        },
      },
    },
    date_emission: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "La date d'emission doit être une date valide.",
        },
        notEmpty: {
          msg: "La date d'emission est requise.",
        },
      },
      defaultValue: DataTypes.NOW,
    },
    montant_total: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Le montant total doit être un nombre valide avec deux decimales.",
        },
        notEmpty: {
          msg: "Le montant total est requis.",
        },
        min: {
          args: [0],
          msg: "Le montant total ne peut pas être negatif.",
        },
      },
    },
    statut_paiement: {
      type: DataTypes.ENUM(
        "en attente",
        "paye",
        "partiellement paye",
        "rembourse"
      ),
      allowNull: false,
      defaultValue: "en attente",
      validate: {
        isIn: {
          args: [["en attente", "paye", "partiellement paye", "rembourse"]],
          msg: "Le statut de paiement n'est pas valide.",
        },
        notEmpty: {
          msg: "Le statut de paiement est requis.",
        },
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "facture",
  }
);

module.exports = facture;
