"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const panierProduit = require("./panierproduit");
const commandeProduit = require("./commandeproduit");
const produit = sequelize.define(
  "produit",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Veuillez mettre le nom du produit",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Veuillez mettre la description de ce produit",
        },
      },
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Veuillez mettre le prix unitaire de ce produit",
        },
      },
    },
    image: {
      type: DataTypes.STRING(250),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Veuillez ne rien remplacer sur l'image",
        },
      },
    },
    categorie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    marque: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Veuillez mettre la marque de ce produit",
        },
      },
    },
    numero_serie: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    caracteristique_principale: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Veuillez mettre les caracteristiques dece produits",
        },
      },
    },
    reduction: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
      validate: {
        isDecimal: {
          msg: "La valeur de la reduction du produit est en decimal",
        },
      },
    },
    tva_pourcentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 20.0,
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "La valeur de la TVA est en decimal",
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
    modelName: "produit",
  }
);

produit.hasMany(panierProduit, { foreignKey: "produit_id" });
panierProduit.belongsTo(produit, { foreignKey: "produit_id" });

produit.hasMany(commandeProduit, { foreignKey: "produit_id" });
commandeProduit.belongsTo(produit, { foreignKey: "produit_id" });

module.exports = produit;
