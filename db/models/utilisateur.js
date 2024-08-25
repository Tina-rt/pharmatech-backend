"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const panier = require("./panier");
const paiement = require("./paiement");
const livraison = require("./livraison");
const commande = require("./commande");
const utilisateur = sequelize.define(
  "utilisateur",
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
        notEmpty: {
          msg: "Veuillez informer votre nom",
        },
      },
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Veuillez informer votre prenom",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Format de email non valide",
        },
        notEmpty: {
          msg: "Veuillez informer votre email",
        },
      },
    },
    motdepasse: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Veuillez informer votre Mot de passe",
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [9, 16],
          msg: "Numero entre 9 a 16 caracteres.",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "client"),
      allowNull: false,
      defaultValue: "client",
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
    modelName: "utilisateur",
  }
);

utilisateur.hasMany(panier, { foreignKey: "utilisateur_id" });
panier.belongsTo(utilisateur, { foreignKey: "utilisateur_id" });
utilisateur.hasMany(commande, { foreignKey: "utilisateur_id" });
commande.belongsTo(utilisateur, { foreignKey: "utilisateur_id" });
module.exports = utilisateur;
