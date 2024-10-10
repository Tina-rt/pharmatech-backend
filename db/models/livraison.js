"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const methodeLivraison = require("./methodelivraison");

const livraison = sequelize.define(
  "livraison",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    commande_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "commande",
        key: "id",
      },
      allowNull: false,
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
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Format de l'email non valide",
        },
        notNull: {
          msg: "Veuillez mettre l'email",
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [9, 16],
          msg: "Numéro de téléphone entre 9 et 16 caractères",
        },
        notNull: {
          msg: "Veuillez mettre le numero telephone",
        },
      },
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prescription: {
      type: DataTypes.STRING,
    },
    ville: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code_postal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_livraison: {
      type: DataTypes.DATE,
    },
    transporteur: {
      type: DataTypes.STRING,
    },
    numero_suivi: {
      type: DataTypes.STRING,
    },
    statut_livraison: {
      type: DataTypes.ENUM("En attente", "En transit", "Livrée", "Retour"),
      defaultValue: "en attente",
    },
    // methode_livraison_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "methodeLivraison",
    //     key: "id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // },
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
    modelName: "livraison",
  }
);

// methodeLivraison.hasMany(livraison, {
//   foreignKey: "methode_livraison_id",
//   as: "livraison",
// });
// livraison.belongsTo(methodeLivraison, {
//   foreignKey: "methode_livraison_id",
//   as: "methodeLivraison",
// });


module.exports = livraison;
