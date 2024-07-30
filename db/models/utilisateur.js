"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
module.exports = sequelize.define(
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
    adresse: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [10, 15],
          msg: "Numero entre 10 a 15 caracteres.",
        },
        isNumeric: {
          msg: "Juste des nombres",
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
